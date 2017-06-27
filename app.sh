export PATH=$PATH:/home/gauri/.local/bin 
echo $PATH

COMMAND=$1
STAGE=$2
APP_NAME=$3
APP_VERSION=$4

if [ "$COMMAND" != "create" -a "$COMMAND" != "build" -a "$COMMAND" != "run" -a "$COMMAND" != "push" -a "$COMMAND" != "update" -a "$COMMAND" != "delete" ] || [ "$STAGE" != "devo" -a "$STAGE" != "gamma" -a "$STAGE" != "prod" ] || [ "$APP_NAME" == "" ] || [ "$APP_VERSION" == "" ]
then
  echo "syntax: bash app.sh <command> <stage> <app-name> <app-version>"
  exit 0
fi



if [ ! -f "Dockerfile.raw" ]; then
  echo "Could not find Dockerfile.raw !"
  exit 0
fi

WORK_DIR=$(pwd)
cd ../ecs && git pull && cd $WORK_DIR



if [ $STAGE == "devo" ]
then
  AWS_PROJ_ID="381780986962"
  VPC_ID="vpc-662a5602"
  LB_LISTNER="arn:aws:elasticloadbalancing:ap-southeast-1:381780986962:listener/app/devo-lb-pvt/9063c6c4e264ea17/33322206f52c31c4"
  SNS_RESOURCE="arn:aws:sns:ap-southeast-1:381780986962:devo-ecs-asg-sns"
  AUTO_SCALING_IAM_ROLE="arn:aws:iam::381780986962:role/autoscaling_ecs"
elif [ $STAGE == "gamma" ]
then
  AWS_PROJ_ID="370531249777"
  VPC_ID="vpc-c13c7da5"
  LB_LISTNER="arn:aws:elasticloadbalancing:ap-southeast-1:370531249777:listener/app/gamma-lb-pvt/98bfeb8d67ee2d26/a854c15563502db0"
  SNS_RESOURCE="arn:aws:sns:ap-southeast-1:370531249777:gamma-ecs-asg-sns"
  AUTO_SCALING_IAM_ROLE="arn:aws:iam::370531249777:role/ecsAutoscaleRole"
elif [ $STAGE == "prod" ]
then
  AWS_PROJ_ID="370531249777"
  VPC_ID="vpc-c13c7da5"
  LB_LISTNER="arn:aws:elasticloadbalancing:ap-southeast-1:370531249777:listener/app/prod-lb-pvt/bfbfa36e82445261/0104e43e491b57f8"
  SNS_RESOURCE="arn:aws:sns:ap-southeast-1:370531249777:prod-ecs-asg-sns"
  AUTO_SCALING_IAM_ROLE="arn:aws:iam::370531249777:role/ecsAutoscaleRole"
fi

ECR_REPO=$AWS_PROJ_ID.dkr.ecr.ap-southeast-1.amazonaws.com/$STAGE
ECR_IMAGE=$ECR_REPO/$APP_NAME:$APP_VERSION



if [ $COMMAND == "create" ]
then

  cat Dockerfile.raw \
    | sed "s#\$DOCKER_REPO#$ECR_REPO#g" \
    | sed "s#\$STAGE#$STAGE#g" \
    > Dockerfile
  cat ecr-task-def.raw \
    | sed "s#\$STAGE#$STAGE#g" \
    | sed "s#\$DOCKER_REPO#$ECR_REPO#g" \
    | sed "s#\$APP_NAME#$APP_NAME#g" \
    | sed "s#\$APP_VERSION#$APP_VERSION#g" \
    > ecr-task-def.json

  aws ecr create-repository --repository-name $STAGE/$APP_NAME >> /dev/null 2>&1
  echo ... create ecr repository: $STAGE/$APP_NAME

  echo ... started creating target group
  echo AWS Response:
  echo "****************************************************************"
  TARGET_GRP=$(aws elbv2 create-target-group \
    --name ecs-$STAGE-$APP_NAME-tg \
    --protocol HTTP \
    --port 80 \
    --vpc-id $VPC_ID \
    --health-check-protocol HTTP \
    --health-check-path /health \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 5 \
    --unhealthy-threshold-count 5 \
    --matcher HttpCode=200)
  echo $TARGET_GRP
  echo "****************************************************************"
  TARGET_GRP_ARN=$(echo $TARGET_GRP | jq -r '.TargetGroups[0]["TargetGroupArn"]')
  echo ... created target group: $TARGET_GRP_ARN

  echo ... started adding target group to the internal load balancer
  echo AWS Response:
  echo "****************************************************************"
  aws elbv2 create-rule \
    --listener-arn $LB_LISTNER \
    --priority $(date +%M)$(date +%H) \
    --conditions Field=path-pattern,Values=\'/$APP_NAME/*\' \
    --actions Type=forward,TargetGroupArn=$TARGET_GRP_ARN
  echo "****************************************************************"
  echo ... added target group to the internal load balancer

  docker build --tag $ECR_IMAGE .
  echo ... built docker image: $ECR_IMAGE

  $(aws ecr get-login)
  docker push $ECR_IMAGE
  echo ... pushed docker image: $ECR_IMAGE

  TASK_DEF=$(aws ecs register-task-definition --cli-input-json file://ecr-task-def.json)
  TASK_DEF_VER=$(echo $TASK_DEF | jq -r '.taskDefinition.revision')
  echo ... created task definition: $APP_NAME:$TASK_DEF_VER

  echo ... started creating service
  echo AWS response:
  echo "****************************************************************"
  aws ecs create-service \
    --cluster $STAGE-ecs \
    --service-name $APP_NAME \
    --task-definition $APP_NAME:$TASK_DEF_VER \
    --role ecsServiceRole \
    --load-balancers targetGroupArn=$TARGET_GRP_ARN,containerName=$APP_NAME,containerPort=80 \
    --placement-strategy type="spread",field="attribute:ecs.availability-zone" type="binpack",field="cpu" \
    --desired-count 2
  echo "****************************************************************"
  echo ... created service: $APP_NAME

  aws application-autoscaling register-scalable-target \
    --resource-id service/$STAGE-ecs/$APP_NAME \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --min-capacity 2 \
    --max-capacity 100 \
    --role-arn $AUTO_SCALING_IAM_ROLE >> /dev/null 2>&1

  SCALING_POLICY_ARN=$(aws application-autoscaling put-scaling-policy \
    --policy-name ecs-$STAGE-$APP_NAME-scaleup-cpu \
    --service-namespace ecs \
    --resource-id service/$STAGE-ecs/$APP_NAME \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-type StepScaling \
    --step-scaling-policy-configuration "AdjustmentType=ChangeInCapacity,StepAdjustments=[{MetricIntervalLowerBound=0.0,ScalingAdjustment=1}],Cooldown=300,MetricAggregationType=Average" \
    | jq -r '.PolicyARN')

  aws cloudwatch put-metric-alarm \
    --alarm-name ecs-$STAGE-$APP_NAME-cpu80-hi \
    --alarm-description "ECS CPU utilization for $APP_NAME service is greater than 80% for 2 minutes" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 60 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name="ServiceName",Value="$APP_NAME" Name="ClusterName",Value="$STAGE-ecs" \
    --evaluation-periods 2 \
    --treat-missing-data missing \
    --alarm-actions $SNS_RESOURCE $SCALING_POLICY_ARN >> /dev/null 2>&1

  SCALING_POLICY_ARN=$(aws application-autoscaling put-scaling-policy \
    --policy-name ecs-$STAGE-$APP_NAME-scaledown-cpu \
    --service-namespace ecs \
    --resource-id service/$STAGE-ecs/$APP_NAME \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-type StepScaling \
    --step-scaling-policy-configuration "AdjustmentType=ChangeInCapacity,StepAdjustments=[{MetricIntervalUpperBound=0.0,ScalingAdjustment=-1}],Cooldown=300,MetricAggregationType=Average" \
    | jq -r '.PolicyARN')

  aws cloudwatch put-metric-alarm \
    --alarm-name ecs-$STAGE-$APP_NAME-cpu40-lo \
    --alarm-description "ECS CPU utilization for $APP_NAME service is less than 40% for 10 minutes" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 60 \
    --threshold 40 \
    --comparison-operator LessThanThreshold \
    --dimensions Name="ServiceName",Value="$APP_NAME" Name="ClusterName",Value="$STAGE-ecs" \
    --evaluation-periods 10 \
    --treat-missing-data missing \
    --alarm-actions $SNS_RESOURCE $SCALING_POLICY_ARN >> /dev/null 2>&1

  SCALING_POLICY_ARN=$(aws application-autoscaling put-scaling-policy \
    --policy-name ecs-$STAGE-$APP_NAME-scaleup-burst \
    --service-namespace ecs \
    --resource-id service/$STAGE-ecs/$APP_NAME \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-type StepScaling \
    --step-scaling-policy-configuration "AdjustmentType=ChangeInCapacity,StepAdjustments=[{MetricIntervalLowerBound=0.0,ScalingAdjustment=10}],Cooldown=300,MetricAggregationType=Average" \
    | jq -r '.PolicyARN')

  aws cloudwatch put-metric-alarm \
    --alarm-name ecs-$STAGE-$APP_NAME-cpu100-hi \
    --alarm-description "ECS CPU utilization for $APP_NAME service is 100% for 15 minutes" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 60 \
    --threshold 100 \
    --comparison-operator GreaterThanOrEqualToThreshold \
    --dimensions Name="ServiceName",Value="$APP_NAME" Name="ClusterName",Value="$STAGE-ecs" \
    --evaluation-periods 15 \
    --treat-missing-data missing \
    --alarm-actions $SNS_RESOURCE $SCALING_POLICY_ARN >> /dev/null 2>&1

  SCALING_POLICY_ARN=$(aws application-autoscaling put-scaling-policy \
    --policy-name ecs-$STAGE-$APP_NAME-scaleup-mem \
    --service-namespace ecs \
    --resource-id service/$STAGE-ecs/$APP_NAME \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-type StepScaling \
    --step-scaling-policy-configuration "AdjustmentType=ChangeInCapacity,StepAdjustments=[{MetricIntervalLowerBound=0.0,ScalingAdjustment=1}],Cooldown=300,MetricAggregationType=Average" \
    | jq -r '.PolicyARN')

  aws cloudwatch put-metric-alarm \
    --alarm-name ecs-$STAGE-$APP_NAME-memory90-hi \
    --alarm-description "ECS memory utilization for $APP_NAME service is more than 90% for 5 minutes" \
    --metric-name MemoryUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 60 \
    --threshold 90 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name="ServiceName",Value="$APP_NAME" Name="ClusterName",Value="$STAGE-ecs" \
    --evaluation-periods 5 \
    --treat-missing-data missing \
    --alarm-actions $SNS_RESOURCE $SCALING_POLICY_ARN >> /dev/null 2>&1

  echo ... service autoscaling rules and alarms created: $APP_NAME

  rm Dockerfile
  rm ecr-task-def.json

elif [ $COMMAND == "build" ]
then

  cat Dockerfile.raw \
    | sed "s#\$DOCKER_REPO#$ECR_REPO#g" \
    | sed "s#\$STAGE#$STAGE#g" \
    > Dockerfile
  docker build --tag $ECR_IMAGE .
  rm Dockerfile

elif [ $COMMAND == "run" ]
then

  cat Dockerfile.raw \
    | sed "s#\$DOCKER_REPO#$ECR_REPO#g" \
    | sed "s#\$STAGE#$STAGE#g" \
    > Dockerfile
  docker build --tag $ECR_IMAGE .
  rm Dockerfile
  docker run $ECR_IMAGE

elif [ $COMMAND == "push" ]
then

  cat Dockerfile.raw \
    | sed "s#\$DOCKER_REPO#$ECR_REPO#g" \
    | sed "s#\$STAGE#$STAGE#g" \
    > Dockerfile
  cat ecr-task-def.raw \
    | sed "s#\$STAGE#$STAGE#g" \
    | sed "s#\$DOCKER_REPO#$ECR_REPO#g" \
    | sed "s#\$APP_NAME#$APP_NAME#g" \
    | sed "s#\$APP_VERSION#$APP_VERSION#g" \
    > ecr-task-def.json
  docker build --tag $ECR_IMAGE .
  $(aws ecr get-login)
  docker push $ECR_IMAGE
  aws ecs register-task-definition --cli-input-json file://ecr-task-def.json
  rm Dockerfile
  rm ecr-task-def.json

elif [ $COMMAND == "update" ]
then

  cat Dockerfile.raw \
    | sed "s#\$DOCKER_REPO#$ECR_REPO#g" \
    | sed "s#\$STAGE#$STAGE#g" \
    > Dockerfile
  cat ecr-task-def.raw \
    | sed "s#\$STAGE#$STAGE#g" \
    | sed "s#\$DOCKER_REPO#$ECR_REPO#g" \
    | sed "s#\$APP_NAME#$APP_NAME#g" \
    | sed "s#\$APP_VERSION#$APP_VERSION#g" \
    > ecr-task-def.json
  docker build --tag $ECR_IMAGE .
  $(aws ecr get-login)
  docker push $ECR_IMAGE
  TASK_DEF_VER=$(aws ecs register-task-definition --cli-input-json file://ecr-task-def.json | jq -r '.taskDefinition.revision')
  aws ecs update-service \
    --cluster $STAGE-ecs \
    --service $APP_NAME \
    --task-definition $APP_NAME:$TASK_DEF_VER
  rm Dockerfile
  rm ecr-task-def.json

elif [ $COMMAND == "delete" ]
then

  aws ecs update-service --cluster pratilipi-$STAGE-ecs --service $APP_NAME --desired-count 0
  aws ecs delete-service --cluster pratilipi-$STAGE-ecs --service $APP_NAME

fi
