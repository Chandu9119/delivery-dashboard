sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function(Controller, MessageBox, Filter, FilterOperator, Export, ExportTypeCSV) {
	"use strict";

	return Controller.extend("com.dashboardzDeliveryDashboard.controller.View1", {

		onInit: function() {

			sap.ui.core.BusyIndicator.show(0);

			var oModel = new sap.ui.model.odata.v2.ODataModel("/HANA/sap/opu/odata/sap/ZEPCIS_DASHB_CDS/");
			var that = this;

			oModel.read("/ZEPCIS_DASHB", {

				success: function(oParr) {
					var oNewModel = new sap.ui.model.json.JSONModel();
					oNewModel.setData(oParr.results);
					that.getView().setModel(oNewModel);

					var globalModel = new sap.ui.model.json.JSONModel(oParr.results);
					var oGlobalModel = sap.ui.getCore().setModel(globalModel, "globalModelOne");

					var oSearchDate = oNewModel.getData();
					var oArray = [];
					var latestDate = null; // Initialize to store the latest date
					var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy-MM-dd"
					});

					// Iterate over the data to find the latest date
					oSearchDate.forEach(function(item) {
						if (item.PGIDate) {
							var currentDate = dateFormatter.format(item.PGIDate);
							if (latestDate === null || currentDate > latestDate) {
								latestDate = currentDate;
							}
						}
					});

					// Format the latest date for use in the model
					var oSearchInitialDate = latestDate;

					// Create a JSONModel with the latest date
					var oSearchModel = new sap.ui.model.json.JSONModel();
					oSearchModel.setData(oSearchInitialDate);
					that.getView().setModel(oSearchModel, "autoSearchModel"); // Set the model to the view

					// Proceed with the search logic
					that.onLoading();
					that.datechange();
					setTimeout(function() {
						sap.ui.core.BusyIndicator.hide();
					}, 2000);

					// var oPopOver = this.getView().byId("idPopOver");
					// oPopOver.connect(this.getView().byId("idStackedBarChart").getVizUid());
					// oPopOver.setActionItems([{

					// }]);

					// var oSearchDate = oNewModel.getData();
					// var oArray = [];
					// var fDate;
					// var date = sap.ui.core.format.DateFormat.getDateInstance({
					// 	pattern: "yyyy-MM-dd"
					// });

					// // oSearchDate.forEach(function(item) {
					// // 	if (item.PGIDate) {
					// // 		if (oArray.length === 0) {
					// // 			oArray.push(item.PGIDate);
					// // 		} else if (oArray[0] < item.PGIDate) {
					// // 			oArray[0] = date.format(item.PGIDate);
					// // 		}
					// // 	}
					// // });
					// // comparing dates after the dates are formatted 
					// oSearchDate.forEach(function(item) {
					// 	if (item.PGIDate) {
					// 		if (oArray.length === 0) {

					// 			var fromDate = date.format(item.PGIDate);
					// 			oArray.push(fromDate);
					// 		} else if (oArray[0] < date.format(item.PGIDate)) {
					// 			fDate = date.format(item.PGIDate);
					// 			oArray[0] = fDate;

					// 		}
					// 	}
					// });

					// var oSearchInitialDate = fDate;
					// var oSearchModel = new sap.ui.model.json.JSONModel(oSearchInitialDate, "autoSearchModel");

					// that.onsearch();

				}

			});

			var oDate = this.getView().byId("from");
			var oFisrtDate = this.getView().byId("from").getDateValue();
			var oToDate = this.getView().byId("from").getSecondDateValue();

			oDate.attachChange(this.datechange, this);

			// var oView = this.getView();
			// var oChart = oView.byId("idStackedBarChart");
			// var oPopOver = oView.byId("idPopOver");

			// // Connect the popover to the chart
			// oPopOver.connect(oChart.getVizUid());
			// var oChartDom = oChart.getDomRef();

			// // Add event handler for data point hover
			// jQuery(oChartDom).on("mouseover", ".vui5-viz-frame-viz", function(oEvent) {
			// 	var oDataPoint = oEvent.getParameter("data");
			// 	var oDomRef = oEvent.getParameter("domRef");

			// 	// Extract relevant information from the data point
			// 	var sDetail = "Details:\n";
			// 	sDetail += "Category: " + oDataPoint[0].category + "\n";
			// 	sDetail += "Sent: " + oDataPoint[0].Sent + "\n";
			// 	sDetail += "Failure: " + oDataPoint[0].Failure + "\n";
			// 	sDetail += "Warnings: " + oDataPoint[0].Warnings + "\n";

			// 	// Update the popover content
			// 	oPopOver.setContent([
			// 		new sap.m.Text({
			// 			text: sDetail
			// 		})
			// 	]);

			// 	// Open the popover near the data point
			// 	oPopOver.openBy(oDomRef);
			// });

			// // Optional: Close the popover when the mouse leaves the chart
			// jQuery(oChartDom).on("mouseout", ".vui5-viz-frame-viz", function() {
			// 	oPopOver.close();
			// });
			// var oView = this.getView();
			// var oChart = oView.byId("idStackedBarChart");

			// // Handle hover event
			// oChart.attachEvent("dataPointHover", function(oEvent) {
			// 	var oDataPoint = oEvent.getParameter("data");
			// 	var oDomRef = oEvent.getParameter("domRef");

			// 	// Create a detailed content for the tooltip
			// 	var sDetail = "Details:\n";
			// 	sDetail += "Customer: " + oDataPoint[0].category + "\n";
			// 	sDetail += "Sent: " + oDataPoint[0].Sent + "\n";
			// 	sDetail += "Failure: " + oDataPoint[0].Failure + "\n";
			// 	sDetail += "Warnings: " + oDataPoint[0].Warnings + "\n";

			// 	// Set the content of the tooltip
			// 	oChart.getTooltip().setText(sDetail);
			// });

			// // Optional: Clear the tooltip when mouse leaves
			// oChart.attachEvent("dataPointOut", function() {
			// 	oChart.getTooltip().setText("");
			// });
			// var oView = this.getView();
			// var oChart = oView.byId("idStackedBarChart");
			// var oPopOver = oView.byId("idPopOver");
			// var oPopoverText = oView.byId("idPopoverText");

			// // Connect the popover to the chart
			// oPopOver.connect(oChart.getVizUid());

			// // Get the DOM element of the chart
			// var oChartDom = oChart.getDomRef();

			// // Handle hover (mouseover) and out (mouseout) events
			// jQuery(oChartDom).on("mouseover", ".vui5-viz-frame-viz", function(event) {
			// 	var oTarget = event.target; // Element being hovered over

			// 	// Use SAPUI5's VizFrame API to get the data point info
			// 	var oData = oChart.getVizProperties().data;
			// 	// Assume oData is available, adapt to your data structure
			// 	var sDetail = "Details:\n";
			// 	sDetail += "Category: " + oData.category + "\n";
			// 	sDetail += "Value: " + oData.value + "\n";

			// 	// Update popover content
			// 	oPopoverText.setText(sDetail);

			// 	// Open the popover near the target element
			// 	oPopOver.openBy(oTarget);
			// });

			// // Close popover on mouse out
			// jQuery(oChartDom).on("mouseout", ".vui5-viz-frame-viz", function() {
			// 	oPopOver.close();
			// });

			// oToDate.attachChange(this.datechange, this);

			// var ToDatePicker = this.getView().byId("to");
			// FromDatePicker.attachChange(this.datechange, this);
			// ToDatePicker.attachChange(this.datechange, this);

			// sap.ui.core.BusyIndicator.hide();

		},
		getSplitConObj: function() {
			return this.byId("splitcontainer");
		},
		presssuccess: function(oEve) {
			var oSuccessLength = this.getView().byId("numericSuccess").getValue();
			if (oSuccessLength !== "0") {
				var oSplitApp = this.getView().byId("splitcontainer");
				var sDetailId = this.createId("detailDetail");
				oSplitApp.to(sDetailId);

				var dataModel = this.getView().getModel();
				var data = dataModel.getData();
				var oNewModelResultSuccess = new sap.ui.model.json.JSONModel(data);
				var oSuceessTable = this.getView().byId("tableSuccessId");
				var oSuceessTableModel = oSuceessTable.setModel(oNewModelResultSuccess);
				var obindings = oSuceessTable.getBinding("items");
				var succeessStatus = "EPCIS Sent Successfully";
				var oFilter = new Filter("EpcisOverall", FilterOperator.EQ, succeessStatus);
				var resultSucces = obindings.filter(oFilter);
			}
		},
		backToDetail: function() {
			var oSplitApp = this.getSplitConObj();
			oSplitApp.backDetail();

		},
		presssentwithwarnings: function() {
			var oSentWithWarnings = this.getView().byId("numericSentWithwarnings").getValue();
			if (oSentWithWarnings !== "0") {

				var oSplitApp = this.getSplitConObj();
				var sDetailId = this.createId("epcissenterror");
				oSplitApp.to(sDetailId);

				var dataModel = this.getView().getModel();
				var data = dataModel.getData();
				var oNewModelResultWarnings = new sap.ui.model.json.JSONModel(data);
				var oSentWithWarningsTable = this.getView().byId("tableSentWithWarningsId");
				var oSentWithWarningsTableModel = oSentWithWarningsTable.setModel(oNewModelResultWarnings);
				var obindings = oSentWithWarningsTable.getBinding("items");
				var oFlag = "3";
				var oFilter = new Filter("Flag", FilterOperator.Contains, oFlag);
				var oSucces = obindings.filter(oFilter);
			}
		},
		pressnotsent: function() {
			var oNotSent = this.getView().byId("numeriFailure").getValue();
			if (oNotSent !== "0") {
				var oSplitApp = this.getSplitConObj();
				var sDetailId = this.createId("epcissentno");
				oSplitApp.to(sDetailId);

				var dataModel = this.getView().getModel();
				var data = dataModel.getData();
				var oNewModelResultNotSent = new sap.ui.model.json.JSONModel(data);
				var oNotSentTable = this.getView().byId("tableNotSentId");
				var oNotsentTable = oNotSentTable.setModel(oNewModelResultNotSent);
				var obindings = oNotSentTable.getBinding("items");
				var oSentStatus = "EPCIS not Sent";
				var oFilter = new Filter("EpcisStatus", FilterOperator.Contains, oSentStatus);
				var oSucces = obindings.filter(oFilter);
			}

		},
		datechange: function() {
			var date = this.getView().getModel("autoSearchModel").getData();
			var oFisrtDate = this.getView().byId("from").getDateValue();
			var oToDate = this.getView().byId("from").getSecondDateValue(); // Changed to `getDateValue()` for 'to' date picker
			var oTitle = this.getView().byId("detaildate");
			if (date && !oFisrtDate && !oToDate) {
				var newTitle = "Delivery Dashboard (" + date + " )";
				oTitle.setText(newTitle);
				return;
			}

			var DateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd" // Adjust pattern if needed
			});

			if (oFisrtDate && oToDate) { // Both dates are present
				if (oFisrtDate.getTime() !== oToDate.getTime()) { // Check if dates are different
					var formattedFromDate = DateFormat.format(oFisrtDate);
					var formattedToDate = DateFormat.format(oToDate);
					var newTitle = "Delivery Dashboard (" + formattedFromDate + " - " + formattedToDate + ")";
				} else { // Dates are the same
					var formattedFromDate = DateFormat.format(oFisrtDate);
					var newTitle = "Delivery Dashboard (" + formattedFromDate + ")";
				}
			} else if (oFisrtDate) { // Only 'from' date is present
				var formattedFromDate = DateFormat.format(oFisrtDate);
				var newTitle = "Delivery Dashboard (" + formattedFromDate + ")";
			} else if (oToDate) { // Only 'to' date is present
				var formattedToDate = DateFormat.format(oToDate);
				var newTitle = "Delivery Dashboard (" + formattedToDate + ")";
			} else { // No dates are present
				var newTitle = "Delivery Dashboard";
			}

			oTitle.setText(newTitle);

			// var oFisrtDate = this.getView().byId("from").getDateValue();
			// var oToDate = this.getView().byId("from").getSecondDateValue();
			// var oTitle = this.getView().byId("detaildate");
			// if (oFisrtDate !== oToDate) {
			// 	var DateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			// 		pattern: "yyyy-MM-dd" // Adjust pattern if needed
			// 	});
			// 	var formattedFromDate = DateFormat.format(oFisrtDate);
			// 	var formattedToDate = DateFormat.format(oToDate);

			// 	var newTitle = "Delivery Dashboard (" + formattedFromDate + " - " + formattedToDate + ")";
			// 	oTitle.setText(newTitle);
			// } else if (oFisrtDate === oToDate) {
			// 	var DateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			// 		pattern: "yyyy-MM-dd" // Adjust pattern if needed
			// 	});
			// 	var formattedFromDate = DateFormat.format(oFisrtDate);

			// 	var newTitle = "Delivery Dashboard (" + formattedFromDate + ")";
			// 	oTitle.setText(newTitle);
			// } else {
			// 	oTitle.setText("Delivery Dashboard");
			// }

		},
		oncustomerok: function() {
			var oSElectedItems = sap.ui.core.Fragment.byId("frag", "listCustomerId").getSelectedItems();
			if (oSElectedItems.length > 0) {
				var oSelectedTitles = "";
				for (var i = 0; i < oSElectedItems.length; i++) {
					var sTitle = oSElectedItems[i].getTitle();
					oSelectedTitles += sTitle;
					if (i < oSElectedItems.length - 1) {
						oSelectedTitles += "|";
					}
				}
			}
			this.getView().byId("customer").setValue(oSelectedTitles);
			this.oncustomerclose();
		},
		onokdeliveryplant: function() {
			var oDeliveryPlant = sap.ui.core.Fragment.byId("fragDeliveryPlant", "listDeliveryPlantId").getSelectedItem().getTitle();
			this.getView().byId("deliveryplant").setValue(oDeliveryPlant);
			this.onclosedeliveryplant();
		},
		onLoading: function() {

			var oSearchInitialDate = this.getView().getModel("autoSearchModel").getData();

			var aFilters = [];

			var date = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});

			var oDateFilter = new sap.ui.model.Filter("PGIDate", sap.ui.model.FilterOperator.EQ, oSearchInitialDate);
			aFilters.push(oDateFilter);

			var oModel = new sap.ui.model.odata.v2.ODataModel("/HANA/sap/opu/odata/sap/ZEPCIS_DASHB_CDS/");
			var that = this;

			oModel.read("/ZEPCIS_DASHB", {
				filters: aFilters,
				success: function(oData) {
					var oNewModel = new sap.ui.model.json.JSONModel();
					var model = new sap.ui.model.json.JSONModel();
					oNewModel.setData({});
					model.setData({});
					oNewModel.setData(oData.results);
					that.getView().setModel(oNewModel);

					var filteredData = oNewModel.getData();
					filteredData.forEach(function(item) {

						var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "yyyy-MM-dd" // Adjust pattern if needed
						});

						var changedDate = oDateFormat.format(item.PGIDate);
						item.PGIDate = changedDate;

					});

					var oArray = [];
					var data = [];
					var oNew = [];

					for (var i = 0; i < filteredData.length; i++) {
						if (filteredData[i].EpcisOverall === "EPCIS Sent Successfully") {
							oArray.push({
								"EpcisOverall": filteredData[i].EpcisOverall
							});
						}
					}

					for (var i = 0; i < filteredData.length; i++) {
						if (filteredData[i].EpcisStatus === "EPCIS not Sent") {
							data.push({
								"EpcisStatus": filteredData[i].EpcisStatus
							});
						}
					}

					for (var i = 0; i < filteredData.length; i++) {
						if (filteredData[i].Flag === "3") {
							oNew.push({
								"Flag": filteredData[i].Flag
							});
						}
					}

					var oSuccess = oArray.length;
					var oFailure = data.length;
					var oWarnings = oNew.length;

					that.getView().byId("sucessTile").setModel(model);
					that.getView().byId("sentWithWarningsTile").setModel(model);
					that.getView().byId("notSenttile").setModel(model);

					model.setProperty("/successCount", oSuccess);
					model.setProperty("/notSentValue", oFailure);
					model.setProperty("/sentWithwarnings", oWarnings);

					var oDataDonut = [{
						Status: "Success",
						Count: oSuccess
					}, {
						Status: "Failure",
						Count: oFailure
					}, {
						Status: "Warnings",
						Count: oWarnings
					}];

					var oModelDonut = new sap.ui.model.json.JSONModel({
						data: oDataDonut
					});
					that.getView().byId("idPieChart").setModel(oModelDonut);

					var oCustomerArray = [];
					var dataCustomer = [];
					var oNewCustomer = [];

					for (var m = 0; m < filteredData.length; m++) {
						oCustomerArray.push({
							"SoldToCustomer": filteredData[m].SoldToCustomer
						});
					}
					oCustomerArray.forEach(function(item) {
						if (!oNewCustomer.includes(item.SoldToCustomer)) {
							oNewCustomer.push(item.SoldToCustomer);
						}
					});

					var filteredArray = [];

					// Iterate over each customer in oNewCustomer
					oNewCustomer.forEach(function(customer) {
						// Initialize counts
						var successBar = 0;
						var failureBar = 0;
						var Warnings = 0;

						// Check each item in filteredData
						filteredData.forEach(function(modelItem) {
							if (modelItem.SoldToCustomer === customer) {
								// Count based on conditions
								if (modelItem.EpcisOverall === "EPCIS Sent Successfully") {
									successBar++;
								}

								if (modelItem.EpcisStatus === "EPCIS not Sent") {
									failureBar++;
								}

								if (modelItem.Flag === "3") {
									Warnings++;
								}
							}
						});

						// Push aggregated data for the customer into the filteredArray
						filteredArray.push({
							"Customer": customer,
							"Sent": successBar,
							"Failure": failureBar,
							"SentWithWarnings": Warnings
						});
					});

					// Create JSON model with the filtered data
					var oModelBar = new sap.ui.model.json.JSONModel({
						failureData: filteredArray
					});

					// Set the model to the VizFrame
					that.getView().byId("idStackedBarChart").setModel(oModelBar);
					that.getView().byId("chartContainerContentTable").setModel(oModelBar);
				},
				error: function(oError) {
					MessageBox.error("error");
					// Handle error
				}
			});

		},
		onsearch: function() {

			var oFrom = this.getView().byId("from").getValue();
			// var oTo = this.getView().byId("to").getValue();
			var oSearchCustomer = this.getView().byId("customer").getValue();
			var oSearchMaterial = this.getView().byId("Material").getValue();
			var oSearchDeliveryPlant = this.getView().byId("deliveryplant").getValue();
			var oSearchSalesOrder = this.getView().byId("salesorder").getValue();
			var oSearchDelivery = this.getView().byId("delivery").getValue();
			var oSearchPo = this.getView().byId("PO").getValue();
			var oSearchInitialDate = this.getView().getModel("autoSearchModel").getData();

			if (oSearchCustomer || oSearchMaterial || oSearchDeliveryPlant) {
				if (!oFrom) {
					MessageBox.information("Please select the Date");
					return;
				}
			}
			if (!oFrom && !oSearchCustomer && !oSearchMaterial && !oSearchDeliveryPlant && !oSearchSalesOrder && !oSearchDelivery && !
				oSearchPo) {
				MessageBox.information("Please select the Filters");
			} else {
				var aFilters = [];
				var fDate = this.getView().byId("from").getDateValue();
				var tDate = this.getView().byId("from").getSecondDateValue();
				// var tDate = this.getView().byId("to").getDateValue();
				var date = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});
				var fromDate = date.format(fDate);
				var toDate = date.format(tDate);

				var aMaterialFilters = [];
				var oMaterial = this.getView().byId("Material").getValue().split("|");

				//Customer
				var aCustomerFilters = [];
				var oCustomerName = this.getView().byId("customer").getValue().split("|");

				//Delivery Plant
				var oDeliverPlant = this.getView().byId("deliveryplant").getValue();

				//Sales Order Number
				var oSalesOrder = this.getView().byId("salesorder").getValue();

				//Delivery Number
				var oDeliveryNumber = this.getView().byId("delivery").getValue();

				//Customer
				var oCustomerPo = this.getView().byId("PO").getValue();

				if ((oFrom && !fromDate) || (oFrom && !toDate)) {
					MessageBox.information("Please Input valid date");
					return;
				} else {
					if (fromDate) {
						if (fromDate === toDate) {
							var oDateFilter = new sap.ui.model.Filter("PGIDate", sap.ui.model.FilterOperator.EQ, fromDate);
							aFilters.push(oDateFilter);
						} else {
							var oDateFilter = new sap.ui.model.Filter("PGIDate", sap.ui.model.FilterOperator.BT, fromDate, toDate);
							aFilters.push(oDateFilter);
						}
					}
				}

				if (oMaterial.length > 0 && oMaterial[0] !== "") {
					oMaterial.forEach(function(a) {
						var filter = new sap.ui.model.Filter("MaterialDesc", sap.ui.model.FilterOperator.Contains, a);
						aFilters.push(filter);
					});
				}
				if (oCustomerName.length > 0 && oCustomerName[0] !== "") {
					oCustomerName.forEach(function(a) {
						var filter = new sap.ui.model.Filter("SoldToCustomer", sap.ui.model.FilterOperator.Contains, a);
						aFilters.push(filter);
					});
				}
				if (oDeliverPlant !== "") {
					var oDeliveryFilter = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, oDeliverPlant);
					aFilters.push(oDeliveryFilter);
				}
				if (oSalesOrder !== "") {
					var oSalesOrderFilter = new sap.ui.model.Filter("SaleDOcNo", sap.ui.model.FilterOperator.Contains, oSalesOrder);
					aFilters.push(oSalesOrderFilter);
				}
				if (oDeliveryNumber !== "") {
					var oDeliveryNumberFilter = new sap.ui.model.Filter("Delivery", sap.ui.model.FilterOperator.Contains, oDeliveryNumber);
					aFilters.push(oDeliveryNumberFilter);
				}
				if (oCustomerPo !== "") {
					var oCustomerPoFilter = new sap.ui.model.Filter("PurDocNo", sap.ui.model.FilterOperator.Contains, oCustomerPo);
					aFilters.push(oCustomerPoFilter);
				}

				var oModel = new sap.ui.model.odata.v2.ODataModel("/HANA/sap/opu/odata/sap/ZEPCIS_DASHB_CDS/");
				var that = this;
				if (aFilters.length === 0) {
					MessageBox.error("Please select appropriate Filters");
				} else {
					oModel.read("/ZEPCIS_DASHB", {
						filters: aFilters,
						success: function(oData) {
							var oNewModel = new sap.ui.model.json.JSONModel();
							var model = new sap.ui.model.json.JSONModel();
							oNewModel.setData({});
							model.setData({});
							oNewModel.setData(oData.results);
							that.getView().setModel(oNewModel);

							var filteredData = oNewModel.getData();
							filteredData.forEach(function(item) {

								var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
									pattern: "yyyy-MM-dd" // Adjust pattern if needed
								});

								var changedDate = oDateFormat.format(item.PGIDate);
								item.PGIDate = changedDate;

							});

							var oArray = [];
							var data = [];
							var oNew = [];

							for (var i = 0; i < filteredData.length; i++) {
								if (filteredData[i].EpcisOverall === "EPCIS Sent Successfully") {
									oArray.push({
										"EpcisOverall": filteredData[i].EpcisOverall
									});
								}
							}

							for (var i = 0; i < filteredData.length; i++) {
								if (filteredData[i].EpcisStatus === "EPCIS not Sent") {
									data.push({
										"EpcisStatus": filteredData[i].EpcisStatus
									});
								}
							}

							for (var i = 0; i < filteredData.length; i++) {
								if (filteredData[i].Flag === "3") {
									oNew.push({
										"Flag": filteredData[i].Flag
									});
								}
							}

							var oSuccess = oArray.length;
							var oFailure = data.length;
							var oWarnings = oNew.length;

							that.getView().byId("sucessTile").setModel(model);
							that.getView().byId("sentWithWarningsTile").setModel(model);
							that.getView().byId("notSenttile").setModel(model);

							model.setProperty("/successCount", oSuccess);
							model.setProperty("/notSentValue", oFailure);
							model.setProperty("/sentWithwarnings", oWarnings);

							var oDataDonut = [{
								Status: "Success",
								Count: oSuccess
							}, {
								Status: "Failure",
								Count: oFailure
							}, {
								Status: "Warnings",
								Count: oWarnings
							}];

							var oModelDonut = new sap.ui.model.json.JSONModel({
								data: oDataDonut
							});
							that.getView().byId("idPieChart").setModel(oModelDonut);

							var oCustomerArray = [];
							var dataCustomer = [];
							var oNewCustomer = [];

							for (var m = 0; m < filteredData.length; m++) {
								oCustomerArray.push({
									"SoldToCustomer": filteredData[m].SoldToCustomer
								});
							}
							oCustomerArray.forEach(function(item) {
								if (!oNewCustomer.includes(item.SoldToCustomer)) {
									oNewCustomer.push(item.SoldToCustomer);
								}
							});

							var filteredArray = [];

							// Iterate over each customer in oNewCustomer
							oNewCustomer.forEach(function(customer) {
								// Initialize counts
								var successBar = 0;
								var failureBar = 0;
								var Warnings = 0;

								// Check each item in filteredData
								filteredData.forEach(function(modelItem) {
									if (modelItem.SoldToCustomer === customer) {
										// Count based on conditions
										if (modelItem.EpcisOverall === "EPCIS Sent Successfully") {
											successBar++;
										}

										if (modelItem.EpcisStatus === "EPCIS not Sent") {
											failureBar++;
										}

										if (modelItem.Flag === "3") {
											Warnings++;
										}
									}
								});

								// Push aggregated data for the customer into the filteredArray
								filteredArray.push({
									"Customer": customer,
									"Sent": successBar,
									"Failure": failureBar,
									"SentWithWarnings": Warnings
								});
							});

							// Create JSON model with the filtered data
							var oModelBar = new sap.ui.model.json.JSONModel({
								failureData: filteredArray
							});

							// Set the model to the VizFrame
							that.getView().byId("idStackedBarChart").setModel(oModelBar);
							that.getView().byId("chartContainerContentTable").setModel(oModelBar);

							var oSplitApp = that.getView().byId("splitcontainer");
							var sDetailId = that.createId("detail");
							oSplitApp.to(sDetailId);

						},
						error: function(oError) {
							MessageBox.error("error");
							// Handle error
						}
					});
				}
			}

		},
		onclear: function() {

			var Title = this.getView().byId("detaildate");
			var text = "Delivery Dashboard";
			Title.setText(text);
			this.getView().byId("from").setValue("");
			this.getView().byId("customer").setValue("");
			this.getView().byId("Material").setValue("");
			this.getView().byId("deliveryplant").setValue("");
			this.getView().byId("salesorder").setValue("");
			this.getView().byId("delivery").setValue("");
			this.getView().byId("PO").setValue("");

			var oModel = new sap.ui.model.odata.v2.ODataModel("/HANA/sap/opu/odata/sap/ZEPCIS_DASHB_CDS/");
			var that = this;
			oModel.read("/ZEPCIS_DASHB", {
				success: function(oData) {
					var oNewModel = new sap.ui.model.json.JSONModel();
					oNewModel.setData(oData.results);
					that.getView().setModel(oNewModel);
				}
			});

			// if(this.onValueHelpcustomer){
			// 	this.dialogcustomer = sap.ui.xmlfragment("frag", "com.dashboardzDeliveryDashboard.fragment.customer", this);
			// 	var oModelFrag = this.getView().getModel();
			// 	this.dialogcustomer.setModel(oModelFrag);
			// }

			var success = 0;
			var statusNotSent = 0;
			var sentWithwarnings = 0;

			var model = new sap.ui.model.json.JSONModel();

			this.getView().byId("sucessTile").setModel(model);
			this.getView().byId("sentWithWarningsTile").setModel(model);
			this.getView().byId("notSenttile").setModel(model);

			model.setProperty("/successCount", success);
			model.setProperty("/notSentValue", statusNotSent);
			model.setProperty("/sentWithwarnings", sentWithwarnings);

			var donutModel = this.getView().byId("idPieChart").getModel();
			donutModel.setData([]);

			var barGraphModel = this.getView().byId("idStackedBarChart").getModel();
			barGraphModel.setData([]);

			this.getView().byId("tableSuccessId").getModel().setData([]);
			this.getView().byId("tableSentWithWarningsId").getModel().setData([]);
			this.getView().byId("tableNotSentId").getModel().setData([]);

			var oSplitApp = this.getView().byId("splitcontainer");
			var sDetailId = this.createId("detailDetailHome");
			oSplitApp.to(sDetailId);

		},
		// onSelectionChange:function(oEvent){
		// 	var oList = oEvent.getSource();
		// 	var oLabel = sap.ui.core.Fragment.byId("frag", "idFilterLabel");
		// 	var oInfoToolbar = sap.ui.core.Fragment.byId("frag", "idInfoToolbar");
		// 	var aContexts = oList.getSelectedContexts(true);

		// 	// var aFilters = [];
		// 	// var sQuery = oEvent.getSource().getValue();
		// 	// if (sQuery && sQuery.length > 0) {
		// 	// 	var filter = new Filter("SoldToCustomer", FilterOperator.Contains, sQuery);
		// 	// 	aFilters.push(filter);
		// 	// }

		// 	// update list binding
		// 	// var oFragList = sap.ui.core.Fragment.byId("frag", "listCustomerId");
		// 	// var oBinding = oFragList.getBinding("items");
		// 	// oBinding.filter(aFilters);
		// 	var bSelected = (aContexts && aContexts.length > 0);
		// 	var sText = (bSelected) ? aContexts.length + " selected" : null;
		// 	oInfoToolbar.setVisible(bSelected);
		// 	oLabel.setText(sText);
		// },
		onSearchCustomer: function(oEvent) {

			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("SoldToCustomer", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = sap.ui.core.Fragment.byId("frag", "listCustomerId");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters);
		},
		onSearchMaterial: function(oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("MaterialDesc", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}
			var oList = sap.ui.core.Fragment.byId("fragMaterial", "listMaterialId");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters);
		},
		myOnClickHandler: function(oEvent) {

			// var oPopOver = this.getView().byId("idPopOver");
			// var a = oPopOver.connect(this.getView().byId("idStackedBarChart").getVizUid());
			// oPopOver.setActionItems([{

			// }]);

			var oParameters = oEvent.getParameters();
			var oData = oParameters.data;
			if (oData && oData.length === 1) {
				var clickedData = oEvent.getParameter("data")[0].data;

				var oCustomerName = clickedData.CustomerName;
				var oMeasureNames = clickedData.measureNames;

				// var filterCustomer = new sap.ui.model.Filter("SoldToCustomer", sap.ui.model.FilterOperator.Contains, oCustomerName);

				// var oNewModelResultSuccess = new sap.ui.model.json.JSONModel(clickedData);
				// var oSuceessTable = this.getView().byId("tableBarId");
				// var oSuceessTableModel = oSuceessTable.setModel(oNewModelResultSuccess);
				var filterStatus;
				var aFilters = [];
				var barData = [];
				var dataModel = this.getView().getModel();
				var dataModelData = dataModel.getData();
				dataModelData.forEach(function(item) {
					if (item.SoldToCustomer === oCustomerName) {
						aFilters.push(item);
					}
				});

				if (oMeasureNames === "Sent") {
					if (clickedData.Sent !== 0) {
						aFilters.forEach(function(item) {
							if (item.EpcisOverall === "EPCIS Sent Successfully") {
								barData.push(item);
							}
						});

					}
				} else if (oMeasureNames === "Failure") {
					if (clickedData.Failure !== 0) {
						aFilters.forEach(function(item) {
							if (item.EpcisStatus === "EPCIS not Sent") {
								barData.push(item);
							}
						});

					}
				} else if (oMeasureNames === "Warnings") {
					if (clickedData.Warnings !== 0) {
						aFilters.forEach(function(item) {
							if (item.Flag === "3") {
								barData.push(item);
							}
						});

					}
				} else {
					return;
				}

				if (barData.length !== 0) {
					var oNewModelBar = new sap.ui.model.json.JSONModel(barData);
					var oBarGraph = this.getView().byId("tableBarId");
					var oBarTable = oBarGraph.setModel(oNewModelBar);
					// var obindings = oBarTable.getBinding("items");

					// if (aFilters.length !== 0) {
					// 	var filterCustomer = new sap.ui.model.Filter("SoldToCustomer", sap.ui.model.FilterOperator.Contains, oCustomerName);
					// 	aFilters.push(filterCustomer);

					// 	var oSucces = obindings.filter(aFilters);

					var oSplitApp = this.getSplitConObj();
					var sDetailId = this.createId("epcisBar");
					oSplitApp.to(sDetailId);
				}
				// }
			}

			// myOnClickHandler: function(oEvent) {

			// 	var dataSet = this.getView().byId("idStackedBarChart").getDataset();

			// 	var clickedData = oEvent.getSource("data");
			// 	var item  = clickedData[0];

			// 	var oCustomerName = item.type;
			// 	var oMeasureNames = item.name;

			// 	// var filterCustomer = new sap.ui.model.Filter("SoldToCustomer", sap.ui.model.FilterOperator.Contains, oCustomerName);

			// 	// var oNewModelResultSuccess = new sap.ui.model.json.JSONModel(clickedData);
			// 	// var oSuceessTable = this.getView().byId("tableBarId");
			// 	// var oSuceessTableModel = oSuceessTable.setModel(oNewModelResultSuccess);
			// 	var filterStatus;
			// 	var aFilters = [];

			// 	if (oMeasureNames === "Sent") {
			// 		var filterStatus = new sap.ui.model.Filter("EpcisOverall", sap.ui.model.FilterOperator.Contains, "EPCIS Sent Successfully");
			// 		aFilters.push(filterStatus);
			// 	}
			// 	if (oMeasureNames === "Failure") {
			// 		var filterStatus = new sap.ui.model.Filter("EpcisStatus", sap.ui.model.FilterOperator.Contains, "EPCIS not Sent");
			// 		aFilters.push(filterStatus);
			// 	}
			// 	if (oMeasureNames === "Warnings") {
			// 		var filterStatus = new sap.ui.model.Filter("Flag", sap.ui.model.FilterOperator.Contains, "3");
			// 		aFilters.push(filterStatus);
			// 	}

			// 	var dataModel = this.getView().getModel();
			// 	var dataModelData = dataModel.getData();
			// 	var oNewModelBar = new sap.ui.model.json.JSONModel(dataModelData);
			// 	var oBarGraph = this.getView().byId("tableBarId");
			// 	var oBarTable = oBarGraph.setModel(oNewModelBar);
			// 	var obindings = oBarTable.getBinding("items");
			// 	var filterCustomer = new sap.ui.model.Filter("SoldToCustomer", sap.ui.model.FilterOperator.Contains, oCustomerName);

			// 	aFilters.push(filterCustomer);
			// 	var oSucces = obindings.filter(aFilters);

			// 	var oSplitApp = this.getSplitConObj();
			// 	var sDetailId = this.createId("epcisBar");
			// 	oSplitApp.to(sDetailId);

		},
		onValueHelpcustomer: function() {

			if (!this.dialogcustomer) {

				this.dialogcustomer = sap.ui.xmlfragment("frag", "com.dashboardzDeliveryDashboard.fragment.customer", this);
				// this.getView().addDependent(this.dialogcustomer);
				this.dialogcustomer.open();
			}
			this.dialogcustomer.open();

			var oModel = sap.ui.getCore().getModel("globalModelOne").getData();
			var oArray = [];
			var data = [];
			var oNew = [];

			function formatCapitalizeEachWord(text) {
				if (!text) return ""; // Handle empty or null input

				return text
					.toLowerCase() // Ensure the entire string is lowercase
					.split(' ') // Split the text into words
					.map(function(word) {
						return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter
					})
					.join(' '); // Join words back into a single string
			}

			for (var i = 0; i < oModel.length; i++) {
				oArray.push({
					"SoldToCustomer": formatCapitalizeEachWord(oModel[i].SoldToCustomer)
				});
			}
			oArray.forEach(function(item) {
				if (!oNew.includes(item.SoldToCustomer)) {
					oNew.push(item.SoldToCustomer);
					data.push({

						"SoldToCustomer": item.SoldToCustomer
					});

				}
			});
			var model = new sap.ui.model.json.JSONModel(data);
			this.dialogcustomer.setModel(model);

		},
		oncustomerclose: function() {
			// sap.ui.core.Fragment.byId("frag", "idInfoToolbar").setVisible(false);
			this.dialogcustomer.close();
		},
		onValueHelpmaterial: function() {

			if (!this.dialogmaterial) {

				this.dialogmaterial = sap.ui.xmlfragment("fragMaterial", "com.dashboardzDeliveryDashboard.fragment.material", this);
				// this.getView().addDependent(this.dialogmaterial);
				// this.dialogopen.open();
			}
			this.dialogmaterial.open();
			var oModel = sap.ui.getCore().getModel("globalModelOne").getData();
			var oArray = [];
			var data = [];
			var oNew = [];

			for (var i = 0; i < oModel.length; i++) {
				oArray.push({
					"MaterialDesc": oModel[i].MaterialDesc
				});
			}
			oArray.forEach(function(item) {
				if (!oNew.includes(item.MaterialDesc)) {
					oNew.push(item.MaterialDesc);
					data.push({
						"MaterialDesc": item.MaterialDesc
					});

				}
			});
			var model = new sap.ui.model.json.JSONModel(data);
			this.dialogmaterial.setModel(model);

		},
		onokmaterial: function() {
			var oSElectedItems = sap.ui.core.Fragment.byId("fragMaterial", "listMaterialId").getSelectedItems();
			if (oSElectedItems.length > 0) {
				var oSelectedTitles = "";
				for (var i = 0; i < oSElectedItems.length; i++) {
					var sTitle = oSElectedItems[i].getTitle();
					oSelectedTitles += sTitle;
					if (i < oSElectedItems.length - 1) {
						oSelectedTitles += "|";
					}
				}
			}
			this.getView().byId("Material").setValue(oSelectedTitles);
			this.onclosematerial();
		},
		onclosematerial: function() {
			this.dialogmaterial.close();
		},
		onValueHelpdelievryplant: function() {
			if (!this.dialogdeliveryplant) {

				this.dialogdeliveryplant = sap.ui.xmlfragment("fragDeliveryPlant", "com.dashboardzDeliveryDashboard/fragment/deliveryplant",
					this);
				this.getView().addDependent(this.dialogdeliveryplant);
				this.dialogdeliveryplant.open();
			}
			this.dialogdeliveryplant.open();
			var oModel = sap.ui.getCore().getModel("globalModelOne").getData();
			var oArray = [];
			var data = [];
			var oNew = [];

			for (var i = 0; i < oModel.length; i++) {
				oArray.push({
					"Plant": oModel[i].Plant
				});
			}
			oArray.forEach(function(item) {
				if (!oNew.includes(item.Plant)) {
					oNew.push(item.Plant);
					data.push({
						"Plant": item.Plant
					});

				}
			});
			var model = new sap.ui.model.json.JSONModel(data);
			this.dialogdeliveryplant.setModel(model);

		},
		onclosedeliveryplant: function() {
			this.dialogdeliveryplant.close();
		},
		onExportsucess: function() {
			var oTable = this.getView().byId("tableSuccessId").getModel().getData();
			var oArray = [];

			oTable.forEach(function(item) {
				if (item.EpcisOverall === "EPCIS Sent Successfully") {
					oArray.push(item);
				}
			});
			var oModel = new sap.ui.model.json.JSONModel(oArray);
			var aColumns = [{
				name: "Date",
				template: {
					content: "{PGIDate}"
				}
			}, {
				name: "Delivery Number",
				template: {
					content: "{Delivery}"
				}
			}, {
				name: "Material Number",
				template: {
					content: "{MaterialNO}"
				}
			}, {
				name: "Material Description",
				template: {
					content: "{MaterialDesc}"
				}
			}, {
				name: "Quantity",
				template: {
					content: "{Qty}"
				}
			}, {
				name: "Price",
				template: {
					content: "{NetPrice}"
				}
			}, {
				name: "Epcis Status",
				template: {
					content: "{EpcisOverall}"
				}
			}];

			var oExport = new Export({
				exportType: new ExportTypeCSV({
					separatorChar: ",",
					charset: "UTF-8"
				}),
				models: oModel,
				rows: {
					path: "/"
				},
				columns: aColumns
			});

			oExport.saveFile("SuccessItems").catch(function(oError) {
				sap.m.MessageToast.show("Export failed: " + oError.message);
			}).then(function() {
				oExport.destroy();
			});
		},
		onExportwarnings: function() {

			var oTable = this.getView().byId("tableSentWithWarningsId").getModel().getData();
			var oArray = [];

			oTable.forEach(function(item) {
				if (item.Flag === "3") {
					oArray.push(item);
				}
			});
			var oModel = new sap.ui.model.json.JSONModel(oArray);
			var aColumns = [{
				name: "Date",
				template: {
					content: "{PGIDate}"
				}
			}, {
				name: "Material Number",
				template: {
					content: "{MaterialNO}"
				}
			}, {
				name: "Material Description",
				template: {
					content: "{MaterialDesc}"
				}
			}, {
				name: "Quantity",
				template: {
					content: "{Qty}"
				}
			}, {
				name: "Price",
				template: {
					content: "{NetPrice}"
				}
			}, {
				name: "Epcis Status",
				template: {
					content: "{EpcisOverall}"
				}
			}];
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					separatorChar: ",",
					charset: "UTF-8"
				}),
				models: oModel,
				rows: {
					path: "/"
				},
				columns: aColumns
			});
			oExport.saveFile("SentWithWarnings").catch(function(oError) {
				sap.m.MessageToast.show("Export failed: " + oError.message);
			}).then(function() {
				oExport.destroy();
			});
		},
		onExportnotsent: function() {

			var oTable = this.getView().byId("tableNotSentId").getModel().getData();
			var oArray = [];

			oTable.forEach(function(item) {
				if (item.EpcisStatus === "EPCIS not Sent") {
					oArray.push(item);
				}
			});
			var oModel = new sap.ui.model.json.JSONModel(oArray);
			var aColumns = [{
				name: "Date",
				template: {
					content: "{PGIDate}"
				}
			}, {
				name: "Material Number",
				template: {
					content: "{MaterialNO}"
				}
			}, {
				name: "Material Description",
				template: {
					content: "{MaterialDesc}"
				}
			}, {
				name: "Quantity",
				template: {
					content: "{Qty}"
				}
			}, {
				name: "Price",
				template: {
					content: "{NetPrice}"
				}
			}, {
				name: "Epcis Status",
				template: {
					content: "{EpcisOverall}"
				}
			}];
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					separatorChar: ",",
					charset: "UTF-8"
				}),
				models: oModel,
				rows: {
					path: "/"
				},
				columns: aColumns
			});
			oExport.saveFile("NotSentItems").catch(function(oError) {
				sap.m.MessageToast.show("Export failed: " + oError.message);
			}).then(function() {
				oExport.destroy();
			});
		},
		onBarGraphExport: function() {

			var oModel = this.getView().byId("tableBarId").getModel();
			var aColumns = [{
				name: "Date",
				template: {
					content: "{PGIDate}"
				}
			}, {
				name: "Delivery Number",
				template: {
					content: "{Delivery}"
				}
			}, {
				name: "Material Number",
				template: {
					content: "{MaterialNO}"
				}
			}, {
				name: "Material Description",
				template: {
					content: "{MaterialDesc}"
				}
			}, {
				name: "Quantity",
				template: {
					content: "{Qty}"
				}
			}, {
				name: "Price",
				template: {
					content: "{NetPrice}"
				}
			}, {
				name: "Epcis Status",
				template: {
					content: "{EpcisOverall}"
				}
			}];
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					separatorChar: ",",
					charset: "UTF-8"
				}),
				models: oModel,
				rows: {
					path: "/"
				},
				columns: aColumns
			});
			oExport.saveFile("CustomerDetails").catch(function(oError) {
				sap.m.MessageToast.show("Export failed: " + oError.message);
			}).then(function() {
				oExport.destroy();
			});
		}

	});
});