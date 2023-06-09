const neo4j = require('neo4j-driver');

class Neo4jDB {
  constructor() {
    this.driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '073102209727adm'));
    process.on('exit', () => {
      this.driver.close();
    });
  }

  run(query, params = {}, callback) {
    const session = this.driver.session();
    session.run(query, params)
      .then(result => {
        const records = result.records.map(record => record.toObject());
        callback(records);
      })
      .catch(error => {
        callback(error);
      })
      .finally(() => {
        session.close();
      });
  }

  createNode(label, properties, callback) {
    const { name } = properties;
    const query = `MERGE (node:${label}{name:"${name}"}) RETURN node`;
    this.run(query, { }, (error, result) => {
      if (error) {
        callback(error);
      } else {
        callback(result[0].node);
      }
    });
  }

  getNodeById(label, id, callback) {
    const query = `MATCH (node:${label}) WHERE ID(node) = $id RETURN node`;
    this.run(query, { id }, (error, result) => {
      if (error) {
        callback(error);
      } else {
        callback(result[0].node);
      }
    });
  }

  getNodeByName(name, callback) {
    const query = `MATCH (node{name:"${name}"}) RETURN node`;
    this.run(query, { name }, (error, result) => {
      if (error) {
        callback(error);
      } else {
        callback(result[0].node);
      }
    });
  }

  getConnectedNodeByNames(name1, name2, callback) {
    const query = `MATCH (n)-[]-(neighbors) WHERE n.name IN ['${name1}', '${name2}'] RETURN neighbors`;
    this.run(query, {}, (error, result) => {
      if (error) {
        callback(error);
      } else {
        callback(result[0].node);
      }
    });
  }

  updateNode(label, id, properties, callback) {
    this.getNodeById(label, id, (error, node) => {
      if (error) {
        callback(error);
      } else {
        const mergedProperties = { ...node.properties, ...properties };
        const query = `MATCH (node:${label}) WHERE ID(node) = $id SET node = $props RETURN node`;
        this.run(query, { id, props: mergedProperties }, (error, result) => {
          if (error) {
            callback(error);
          } else {
            callback(result[0].node);
          }
        });
      }
    });
  }

  deleteNodeById(label, id, callback) {
    const query = `MATCH (node:${label}) WHERE ID(node) = $id DELETE node`;
    this.run(query, { id }, callback);
  }

  createRelationship(fromLabel, fromId, type, toLabel, toId, callback) {
    const query = `MATCH (from:${fromLabel}), (to:${toLabel}) WHERE ID(from) = $fromId AND ID(to) = $toId CREATE (from)-[rel:${type}]->(to) RETURN rel`;
    this.run(query, { fromId, toId }, (error, result) => {
      if (error) {
        callback(error);
      } else {
        callback(result[0].rel);
      }
    });
  }

  createRelationshipByName(fromName, toName, from, to, relation, callback) {
    const query = `MATCH (from{name:"${fromName}"}), (to{name:"${toName}"}) CREATE (from)-[r:${relation}{from:"${from}", to:"${to}"}]->(to) RETURN r`;
    this.run(query, { }, (error, result) => {
      if (error) {
        callback(error);
      } else {
        callback(result[0].rel);
      }
    });
  }

  getRelationshipById(id, callback) {
    const query = `MATCH ()-[rel]-() WHERE ID(rel) = $id RETURN rel`;
    this.run(query, { id }, (error, result) => {
      if (error) {
        callback(error);
      } else {
        callback(result[0].rel);
      }
    });
  }

  updateRelationship(id, properties, callback) {
    this.getRelationshipById(id, (error, rel) => {
      if (error) {
        callback(error);
      } else {
        const mergedProperties = { ...rel.properties, ...properties };
        const query = `MATCH ()-[rel]-() WHERE ID(rel) = $id SET rel = $props RETURN rel`;
        this.run(query, { id, props: mergedProperties }, (error, result) => {
          if (error) {
            callback(error);
          } else {
            callback(result[0].rel);
          }
        });
      }
    });
  }

  deleteRelationshipById(id, callback) {
    const query = `MATCH ()-[rel]-() WHERE ID(rel) = $id DELETE rel`;
    this.run(query, { id }, callback);
  }
}

module.exports = Neo4jDB;
