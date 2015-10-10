curl --data "client_id=JoMR7FhZ7ARz1zOEOHEGzEzNDEsqItKO&client_secret=VReejS32wvfBezql&grant_type=client_credentials" https://developer.api.autodesk.com/authentication/v1/authenticate --header "Content-Type: application/x-www-form-urlencoded" -k

curl -k --header "Content-Type: application/json" --header "Authorization: Bearer zoJZeG8ykEoR9fs37PPbSG4BtMaF" --data "{\"bucketKey\":\"mybucket\",\"policyKey\":\"transient\"}" https://developer.api.autodesk.com/oss/v2/buckets

curl -k -H "Authorization: Bearer zoJZeG8ykEoR9fs37PPbSG4BtMaF" -X GET https://developer.api.autodesk.com/oss/v2/buckets/duraark/details

curl --header "Authorization: Bearer zoJZeG8ykEoR9fs37PPbSG4BtMaF" --header "Content-Length: 54495" -H "Content-Type:application/octet-stream" --header "Expect:" --upload-file "Nygade_Scan1005-1006_reconstructed.ifc" -X PUT https://developer.api.autodesk.com/oss/v2/buckets/duraark/objects/Nygade_Scan1005-1006_reconstructed.ifc -k

curl -k -H "Content-Type: application/json" -H "Authorization:Bearer zoJZeG8ykEoR9fs37PPbSG4BtMaF" -i -d "{\"urn\":\"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZHVyYWFyay9OeWdhZGVfU2NhbjEwMDUtMTAwNl9yZWNvbnN0cnVjdGVkLmlmYw==\"}" https://developer.api.autodesk.com/viewingservice/v1/register

curl -k -i -H "Authorization: Bearer zoJZeG8ykEoR9fs37PPbSG4BtMaF" -X GET \
https://developer.api.autodesk.com/viewingservice/v1/dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZHVyYWFyay9OeWdhZGVfU2NhbjEwMDUtMTAwNl9yZWNvbnN0cnVjdGVkLmlmYw==/status

curl -k -H "Authorization: Bearer zoJZeG8ykEoR9fs37PPbSG4BtMaF" -X GET \
https://developer.api.autodesk.com/viewingservice/v1/thumbnails/https://developer.api.autodesk.com/viewingservice/v1/dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZHVyYWFyay9OeWdhZGVfU2NhbjEwMDUtMTAwNl9yZWNvbnN0cnVjdGVkLmlmYw==  > thumb.png
