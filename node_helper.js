'use strict';

/* Magic Mirror
 * Node Helper: MMM-WordGenius
 *
 * By drventure
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require('request');

//for parsing the returned HTML
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


module.exports = NodeHelper.create({
	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		console.log("WordGenius-Received notification: " + notification);
		console.log(payload);
		if (notification === "MMM_WordGenius_GetWord") {
			self.getWord(function(jsonData) {
				console.log("WordGenius-GotWord Sending Notification")
				if (jsonData)
				{
					console.log("WordGenius-sending notification");
					console.log(jsonData);
					self.sendSocketNotification("MMM_WordGenius_Result", jsonData);
				}	
			});		
		}
	},


	// retrieve the word of the day from WordGenius
	getWord: function (onSuccess) {
		console.log("WordGenius-Getting word");
		var url = "https://www.wordgenius.com";
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var jsonData = {};
				jsonData.definitions = [];

				var dom = new JSDOM(body);
				var title = dom.window.document.querySelectorAll("h1.WordHeader__title");
				var pronounce = dom.window.document.querySelectorAll("p.WordHeader__paragraph--pronunciation");
				var partOfSpeech = dom.window.document.querySelectorAll("div.WordHeader__row--part");
				var origin = dom.window.document.querySelectorAll("div.WordHeader__row--origin");
				var defs = dom.window.document.querySelectorAll("div.WordHeader__column--definition");
				defs.forEach(d => {
					if (d.children.length > 1) {
						var def = d.children[1].textContent;
						jsonData.definitions.push(def);
					}
				});

				if (title) {
					jsonData.word = title[0].textContent;
					if (pronounce) jsonData.pronunciation = pronounce[0].textContent;
					if (partOfSpeech) jsonData.partOfSpeech = partOfSpeech[0].firstElementChild.lastChild.nodeValue;
					if (origin) jsonData.origin = origin[0].firstElementChild.lastChild.nodeValue;			
					
					console.log("WordGenius-Got word definition");
					console.log(jsonData);

					onSuccess(jsonData);
				}
				else {
					//no word means we failed
					console.log("WordGenius-Unable to retrieve word of the day from www.wordgenius.com")
				}
				
			} else if (error) {
				console.log("WordGenius-" + error);
			}
		});
	},

	
});
