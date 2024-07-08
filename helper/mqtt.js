const logger = require("./logger");
const awsIot = require("aws-iot-device-sdk");
const models = require("../models");
const { MQTT_DATA_SOURCES } = require("./constant");

const QueryLogs = models.QueryLog;
const Vehicle = models.Vehicle;
const Route = models.Route;
const VehicleRouteDriverMaps = models.VehicleRouteDriverMap;

const device = awsIot.device({
  clientId: "onboarddevtestdevice",
  host: "a31nhrmeyspsde-ats.iot.ap-south-1.amazonaws.com",
  certPath: "onboarddevtestdevice.cert.pem",
  keyPath: "onboarddevtestdevice.private.key",
  caPath: "root-CA.crt",
});

var main = {};

let isSubscribed = false;

main.connectToMqtt = () => {
  device.on("connect", function () {
    console.log("STEP - Connecting to AWS IoT Core");
    logger.info("Connected to AWS IoT Core");
    console.log(
      `---------------------------------------------------------------------------------`
    );

    if (!isSubscribed) {
      device.subscribe("devices/bus1", (err, granted) => {
        if (err) {
          logger.error("Subscription error: " + err);
        } else {
          isSubscribed = true;
          logger.info("Subscribed to topics: " + JSON.stringify(granted));
        }
      });
    }
  });

  device.on("message", async function (topic, payload) {
    console.log("message", topic, payload.toString());
    logger.info(
      "Received message on topic " + topic + ": " + payload.toString()
    );

    try {
      console.log(")))))))))))))yaha aata?");
      payload = JSON.parse(payload.toString());

      if (
        !payload["UserType"] ||
        (payload["UserType"] != MQTT_DATA_SOURCES.MOBILE_APP &&
          payload["UserType"] != MQTT_DATA_SOURCES.USER_MODULE &&
          payload["UserType"] != MQTT_DATA_SOURCES.WEB_APP)
      ) {
        logger.debug(
          "The payload is not in appropriate format for topic::" +
            topic +
            " & payload:: " +
            JSON.stringify(payload)
        );
        return;
      }

      if (payload["UserType"] == MQTT_DATA_SOURCES.WEB_APP) {
        let vehicle =
          payload["Bus ID"] &&
          (await Vehicle.findOne({
            where: {
              vehicleModule: payload["Bus ID"],
              isActive: true,
            },
          }));
        let route =
          payload["Route_NO"] &&
          (await Route.findOne({
            where: {
              routeNo: payload["Route_NO"],
            },
          }));
        if (route && vehicle) {
          let vehicleMap = await VehicleRouteDriverMaps.findOne({
            where: {
              vehicleId: vehicle.vehicleId,
              routeId: route.routeId,
            },
            order: [["dateAndTime", "DESC"]],
          });
          if (vehicleMap) {
            console.log("++++++++++++++++++++++++++++++++++++++++++++hellp");
            await vehicleMap.update({
              isVerified: true,
              dateAndTime: payload["date&Time"] || new Date(),
            });
            logger.info(
              "Updated VehicleRouteDriverMap for vehicle ID: " +
                vehicle.vehicleId +
                " and route ID: " +
                route.routeId
            );
          } else {
            logger.error(
              "No VehicleRouteDriverMap found for vehicle ID: " +
                vehicle.vehicleId +
                " and route ID: " +
                route.routeId
            );
          }
        } else {
          if (!vehicle) {
            logger.error("Vehicle not found for Bus ID: " + payload["Bus ID"]);
          }
          if (!route) {
            logger.error(
              "Route not found for Route_NO: " + payload["Route_NO"]
            );
          }
        }
        return;
      }

      let vehicle =
        payload["Bus ID"] &&
        (await Vehicle.findOne({
          where: {
            vehicleModule: payload["Bus ID"],
            isActive: true,
          },
        }));
      if (vehicle) {
        const log = {
          vehicleNo: vehicle.vehicleNo || "",
          routeNo: payload["Route_NO"] || "",
          rssi: payload["Sig RSSI"] || "",
          ackTime: payload["Ack Time"] || "",
          userId: payload["User ID"] || 1,
          source: payload["UserType"],
          requestedAt: payload["date&Time"] || new Date(),
          module: payload["Bus ID"] || "",
        };
        await QueryLogs.create(log);
        logger.info("Created QueryLog for vehicle ID: " + vehicle.vehicleId);
      } else {
        logger.error("Vehicle not found for Bus ID: " + payload["Bus ID"]);
      }
    } catch (err) {
      logger.error("Error processing message: " + err);
    }
  });

  device.on("error", function (error) {
    console.log("Error:", error.toString());
    logger.error("Error:" + error.toString());
  });

  device.on("offline", function () {
    console.log("Device went offline");
    logger.warn("Device went offline");
  });

  device.on("reconnect", function () {
    console.log("Attempting to reconnect...");
    logger.info("Attempting to reconnect...");
  });
};

main.publishToMqtt = (data) => {
  logger.info("Publish to MQTT::" + JSON.stringify(data));

  const publishMessage = (attempts = 0) => {
    if (!device.connected) {
      logger.error(
        "Device not connected. Cannot publish to MQTT. Attempt: " + attempts
      );
      if (attempts < 5) {
        setTimeout(
          () => publishMessage(attempts + 1),
          Math.pow(2, attempts) * 1000
        ); // Exponential backoff
      }
      return;
    }

    try {
      console.log("Attempting to publish...");
      const topic = `devices/${data.BusId}`; // Define the topic
      const message = {
        BusId: data.BusId,
        RouteNo: data.RouteNo,
        Timestamp: new Date().toISOString(),
        Location: {
          Latitude: data.Latitude,
          Longitude: data.Longitude,
        },
        Speed: data.Speed,
        Status: data.Status,
        UserType: data.UserType || "WEB_APP", // Ensure UserType is included
      };

      device.publish(topic, JSON.stringify(message), (err) => {
        if (err) {
          logger.error("Publish error: " + err + " on attempt: " + attempts);
          if (attempts < 5) {
            setTimeout(
              () => publishMessage(attempts + 1),
              Math.pow(2, attempts) * 1000
            ); // Exponential backoff
          }
        } else {
          logger.info("Published message to topic: " + topic);
        }
      });
    } catch (err) {
      logger.error(
        "Error publishing message: " + err + " on attempt: " + attempts
      );
      if (attempts < 5) {
        setTimeout(
          () => publishMessage(attempts + 1),
          Math.pow(2, attempts) * 1000
        ); // Exponential backoff
      }
    }
  };

  publishMessage();
};

module.exports = main;
