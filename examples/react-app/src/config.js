export const userName = '随机用户'// + Math.round(Math.random() * 1000);

const secret = '==';
const enableDataSync = false;

const flags = [
    {
        "id": "robot",
        "variation": "阿尔法猫",
        "timestamp": 1646688885330,
        "variationOptions": [{
            "id": 1,
            "value": "深蓝"
        }, {
            "id": 2,
            "value": "阿尔法猫"
        }],
        "sendToExperiment": true
    },
    {
        "id": "用户信息模块",
        "variation": "v1.0.0",
        "timestamp": 1646380582151,
        "variationOptions": [{
            "id": 1,
            "value": "v1.0.0"
        }, {
            "id": 2,
            "value": "v1.1.0"
        }],
        "sendToExperiment": true
    },
    {
        "id": "user_info_db_migration",
        "variation": "azure",
        "timestamp": 1646267387598,
        "variationOptions": [{
            "id": 1,
            "value": "azure"
        }, {
            "id": 2,
            "value": "aws"
        }],
        "sendToExperiment": true
    }
];

const configBase = {
    options: {
        secret,
        enableDataSync,
        bootstrap: flags
    }
}

export const configWithUser = {
    options: {
        anonymous: false,
        user: {
            userName: userName,
            id: 'fb-demo-' + userName,
            customizedProperties: [
                {
                    "name": "粘性",
                    "value": Math.round(Math.random() * 10).toString()
                },
                {
                    "name": "最近7天活跃度",
                    "value": Math.round(Math.random()).toString()
                },
            ]
        },
        ...configBase.options
    }
}

export const configWithAnonymousUser = {
    options: {
        anonymous: true,
        ...configBase.options
    }
}