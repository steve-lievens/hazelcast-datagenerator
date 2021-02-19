# hazelcast-datagenerator
Command line application to create transactions into the Hazelcast demo application.

It has two required parameters :

  -n, --number_of_transactions  Total number of transactions that will be generated
  -i, --interval                interval between transactions in seconds

Example :

Download repo locally, navigate into the folder and issue :
(node.js runtime required)

```
node . -n 10 -i 1
```

This will create 10 new records with an interval of 1 second.

If you need some new data to come in during a demo, you could do something like this :

```
node . -n 360 -i 10
```

This will create a new transaction every 10 seconds during one hour.

To configure : copy the my.env.defaults to my.env and adjust any parameter needed.

Required :
- REST_ENDPOINT : point it to your running hazelcast client application (make sure to leave the /transaction/create path, only update the hostname & port).
- PAYLOAD_ROW_START : Align with existing data already in the map. The ROW number is also the key in the map, so it should not overlap existing ROW numbers already there. If you're using the sample data of the application, the default number is set correctly.

Optional :
- PAYLOAD_DATE : You can change it to the current date if you want. Format YYYYMMDD