(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

myConnector.init = function(initCallback) {
      tableau.authType = tableau.authTypeEnum.basic;

      if (tableau.phase == tableau.phaseEnum.gatherDataPhase) {
        // If API that WDC is using has an enpoint that checks
        // the validity of an access token, that could be used here.
        // Then the WDC can call tableau.abortForAuth if that access token
        // is invalid.
      }


      initCallback();

      // If we are not in the data gathering phase, we want to store the token
      // This allows us to access the token in the data gathering phase
      if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
          if (tableau.phase == tableau.phaseEnum.authPhase) {
            // Auto-submit here if we are in the auth phase
            tableau.submit()
          }

          return;
      }
  };

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "safety",
            alias: "safety",
            dataType: tableau.dataTypeEnum.float
        },  {
            id: "trust",
            alias: "trust",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "satisfaction",
            alias: "satisfaction",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "start_date",
            alias: "start_date",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "org_level",
            alias: "org_level",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "level_0",
            alias: "level_0",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "level_0_type",
            alias: "level_0_type",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "level_1",
            alias: "level_1",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "level_1_type",
            alias: "level_1_type",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "level_2",
            alias: "level_2",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "level_3",
            alias: "level_3",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "level_3_type",
            alias: "level_3_type",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "level_4",
            alias: "level_4",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "level_4_type",
            alias: "level_4_type",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "version",
            alias: "version",
            dataType: tableau.dataTypeEnum.string
        }
        ];

        var tableSchema = {
            id: "elucdScoreFeed",
            alias: "Elucd Score Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        $.ajax({
            url: "https://vault.elucd.com/scores/?date_from=2019-01-01&date_to=2019-01-31&cadence=monthly",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + window.btoa(tableau.username + ":" + tableau.password));
            },
            success: function(resp) {
              var scores = resp, tableData = [];
              for (var i = 0, len = scores.length; i < len; i++) {
                tableData.push({"id": scores[i].id,
                                "safety": scores[i].safety,
                                "trust": scores[i].trust,
                                "satisfaction": scores[i].satisfaction,
                                "start_date": scores[i].start_date,
                                "org_level": scores[i].org_level,
                                "level_0": scores[i].level_0,
                                "level_0_type": scores[i].level_0_type,
                                "level_1": scores[i].level_1,
                                "level_1_type": scores[i].level_1_type,
                                "level_2": scores[i].level_2,
                                "level_2_type": scores[i].level_2_type,
                                "level_3": scores[i].level_3,
                                "level_3_type": scores[i].level_3_type,
                                "level_4": scores[i].level_4,
                                "level_4_type": scores[i].level_4_type,
                                "version": scores[i].version});
              }
              table.appendRows(tableData);
              doneCallback();
            }
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Elud Score Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
