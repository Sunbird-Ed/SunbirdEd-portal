const _ = require('lodash');
const envHelper = require('./environmentVariablesHelper.js');
const axios  = require('axios');
const apiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN
const uuidv1 = require('uuid/v1')
const dateFormat = require('dateformat')

async function assignOrgAdminAsCollaborator(resourceId, req) {
    console.log("---------------------------"+ resourceId)
    const config = {
        method: "PATCH",
        url: "https://dev.sunbirded.org/action/system/v3/content/update/" + resourceId,
        headers: {
            'x-device-id': 'middleware',
            'x-msgid': uuidv1(),
            'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsclI0MWpJNndlZmZoQldnaUpHSjJhNlowWDFHaE53a21IU3pzdzE0R0MwIn0.eyJqdGkiOiIwZDA4ZTJjZC0zNzQzLTQwNDgtOTcyMy0xZWUyOTZiNjUzNDYiLCJleHAiOjE2MDA0MzIyNDEsIm5iZiI6MCwiaWF0IjoxNjAwMzQ1ODQxLCJpc3MiOiJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJwcm9qZWN0LXN1bmJpcmQtZGV2LWNsaWVudCIsInN1YiI6ImY6NWE4YTNmMmItMzQwOS00MmUwLTkwMDEtZjkxM2JjMGZkZTMxOjk1ZTQ5NDJkLWNiZTgtNDc3ZC1hZWJkLWFkOGU2ZGU0YmZjOCIsInR5cCI6IkJlYXJlciIsImF6cCI6InByb2plY3Qtc3VuYmlyZC1kZXYtY2xpZW50IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiZjQ4MGZiMjYtY2VjNi00MzhhLWE0ZDktMjc3MmRjZmM3NWQ2IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sIm5hbWUiOiJSZXZpZXdlciBVc2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibnRwdGVzdDEwMyIsImdpdmVuX25hbWUiOiJSZXZpZXdlciIsImZhbWlseV9uYW1lIjoiVXNlciIsImVtYWlsIjoidXMqKioqQHlvcG1haWwuY29tIn0.LizCdcApknfjqKUiNC7MYPB09JKLOqI-bngOiiE8zrtlwRNWbL05RS5u0fGBEz5GzsmXS11GofWCGQRWSfn4TrKltLiSSjXy0_4GJue1FPfengje6rLugR5nB9eyXY_l2PsZnwS17h3VDsuYwT5EGayJehQ9NAkapXvra5tBEgNRASUhsqRWTObM19Lgl6XMQWNxPvVeXXYm5jV5Y6v_ydMqC0eZOh49SrRcUhv3O60MEqB7hofVj4pcNKtvjvS4-sJyT-Mg5VDVMHJwgytaT5PLXwSwFL0brHFIxG1NJdVu5cvZL_7du3aFiS9VjWMsEjvu87clmWSWUgluqTzgvg'
          },
        data: {
            "request": {
                "content": {
                    "collaborators": [
                        req.session.userId 
                    ]
                }
            }
        },
        validateStatus: () => true
      }
      return await axios(config)
}

module.exports = {assignOrgAdminAsCollaborator};
