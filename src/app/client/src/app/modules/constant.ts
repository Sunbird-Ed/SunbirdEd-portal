export const FACETS = {
    values: ["primaryCategory", "mission", "contributorOrg", "subject", "medium", "board", "gradeLevel", "mimeType", "geo", "department", "topic", "contentType"],
    mission: [{ name: "Child Educations", count: 1 }, { name: "Flood Relief", count: 3 }],
    contributor_org: [{ name: "Ashoka", count: 1 }, { name: "Societal", count: 1 }],
}
export const requiredFacets = ["primaryCategory", "contentType", "mission", "contributorOrg", "geo", "department", "topic", "contentType", "medium"]
export const requiredFacets2 = ["primaryCategory", "geo", "department", "topic", "contentType", "medium"]
export const additionalCategoryList = [{
    "identifier": "ncf_mission",
    "code": "mission",
    "terms": [
        {
            "identifier": "ncf_mission_water_resource",
            "code": "Water Resource",
            "translations": null,
            "name": "MISSION",
            "description": "Water Resource",
            "index": 1,
            "category": "mission",
            "status": "Live"
        },
        {
            "identifier": "ncf_mission_flood_relief",
            "code": "Flood Relief",
            "translations": null,
            "name": "FLOOD RELIEF",
            "description": "Flood Relief",
            "index": 2,
            "category": "mission",
            "status": "Live"
        }
    ],
    "translations": null,
    "name": "Mission",
    "description": "Mission",
    "index": 6,
    "status": "Live"
}, {
    "identifier": "ncf_contributor_org",
    "code": "contributorOrg",
    "terms": [
        {
            "identifier": "ncf_contributor_org_Ekstep",
            "code": "Ekstep",
            "translations": null,
            "name": "EKSTEP",
            "description": "Ekstep",
            "index": 1,
            "category": "contributorOrg",
            "status": "Live"
        }
    ],
    "translations": null,
    "name": "ContributorOrg",
    "description": "ContributorOrg",
    "index": 7,
    "status": "Live"
}
]



export const currentFrameworkData = [
    {

        "rootOrgName": 'NIIT-2',
        "requiredFacets": ["primaryCategory", "mission", "contributorOrg"]
    },
    {
        "rootOrgName": 'NIIT Demo',
        "requiredFacets": ["geo", "department", "topic", "contentType", "medium"]
    },
    {
        "rootOrgName": '*',
        "requiredFacets": ["primaryCategory", "mission", "contributorOrg"]
    }


]
