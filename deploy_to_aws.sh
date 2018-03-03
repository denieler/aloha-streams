#!/bin/bash

ecs-cli configure profile --profile-name $PROFILE_NAME --access-key $AWS_ACCESS_KEY_ID --secret-key $AWS_SECRET_ACCESS_KEY
ecs-cli configure --region $AWS_DEFAULT_REGION --cluster $AWS_ECS_CLUSTER_NAME

#status of the cluster
# ecs-cli ps --cluster $AWS_ECS_CLUSTER_NAME --region $AWS_DEFAULT_REGION --ecs-profile $PROFILE_NAME

#start cluster
ecs-cli up --cluster $AWS_ECS_CLUSTER_NAME --verbose -region $AWS_DEFAULT_REGION --instance-role $ROLE_NAME --size 1 --instance-type t2.micro --vpc $VPC_ID --subnets $SUBNET_ID --security-group $SECURITY_GROUP_ID --ecs-profile $PROFILE_NAME
#run docker compose over clusters
ecs-cli compose service up --cluster $AWS_ECS_CLUSTER_NAME --region $AWS_DEFAULT_REGION --ecs-profile $PROFILE_NAME --timeout 20
