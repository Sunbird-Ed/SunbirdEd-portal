export const manifest = {
    "id": "form-service",
    "name": "Form service",
    "author": "sunil<sunils@ilimi.in>",
    "version": "1.0",
    "server": {
        "routes": {
            "prefix": "/v1/form"
        },
        "databases": [{
                "type": "cassandra",
                "path": "db/cassandra",
                "compatibility": "~1.0"
            }
        ],
        "dependencies": []
    }
}