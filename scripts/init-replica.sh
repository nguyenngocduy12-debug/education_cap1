#!/bin/bash

echo "Waiting for MongoDB instances to be ready..."
sleep 10

echo "Initializing MongoDB Replica Set..."

mongosh --host mongo-primary:27017 -u admin -p admin123 --authenticationDatabase admin <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo-primary:27017", priority: 2 },
    { _id: 1, host: "mongo-secondary:27017", priority: 1 },
    { _id: 2, host: "mongo-arbiter:27017", arbiterOnly: true }
  ]
})
EOF

echo "Replica Set initialized successfully!"
