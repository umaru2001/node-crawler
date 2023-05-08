const Neo4jDB = require('./Neo4jDB');
const RDFTransfer = require('RDFTransfer');

const triples = await RDFTransfer.trans(data);

const db = new Neo4jDB();

for (const triple of triples) {
    const subjectLabel = triple.subject.type;
    const subjectProperties = triple.subject.value;
    let subjectId = null;

    const objectLabel = triple.object.type;
    const objectProperties = triple.object.value;
    let objectId = null;

    // Check if subject node already exists
    db.getNodeById(subjectLabel, subjectProperties.id, (error, node) => {
        if (error) {
            console.error(error);
        } else if (node) {
            subjectId = node.identity.toNumber();
        } else {
            db.createNode(subjectLabel, subjectProperties, (error, node) => {
                if (error) {
                    console.error(error);
                } else {
                    subjectId = node.identity.toNumber();
                }
            });
        }
    });

    // Check if object node already exists
    db.getNodeById(objectLabel, objectProperties.id, (error, node) => {
        if (error) {
            console.error(error);
        } else if (node) {
            objectId = node.identity.toNumber();
        } else {
            db.createNode(objectLabel, objectProperties, (error, node) => {
                if (error) {
                    console.error(error);
                } else {
                    objectId = node.identity.toNumber();
                }
            });
        }
    });

    // Create relationship
    const type = triple.predicate.value;
    db.createRelationship(subjectLabel, subjectId, type, objectLabel, objectId, (error, rel) => {
        if (error) {
            console.error(error);
        } else {
            // Update properties if any
            const properties = triple.properties;
            if (properties) {
                if (subjectId) {
                    db.updateNode(subjectLabel, subjectId, properties, (error, node) => {
                        if (error) {
                            console.error(error);
                        }
                    });
                }
                if (objectId) {
                    db.updateNode(objectLabel, objectId, properties, (error, node) => {
                        if (error) {
                            console.error(error);
                        }
                    });
                }
                db.updateRelationship(rel.identity.toNumber(), properties, (error, rel) => {
                    if (error) {
                        console.error(error);
                    }
                });
            }
        }
    });
}

// Close database connection
db.driver.close();
