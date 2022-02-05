Module.register("MMM-WordGenius", {
	// Default module config.
	defaults: {
		updateInterval: 120000,
		headerText: "Word Genius Word of the Day"
	},
	
	requiresVersion: "2.1.0",

	start: function() {
		this.dataNotification = null;
		this.getWord();

		var self = this;
        //Schedule updates
		console.log("WordGenius-UpdateInterval: " + this.config.updateInterval);
        setInterval(function() {
            self.getWord();
            //self.updateDom();
        }, this.config.updateInterval);
	},
	
	getScripts: function() {
		return [
			//not used for WordGenius
			//'xml2json.min.js',
		]
	},
	
	getStyles: function() {
		return [
			this.file('style.css'), // this file will be loaded straight from the module folder.
		]
	},
	
	//Contact node helper for solar data
	getWord: function() {
		console.log("WordGenius-getting word");

		this.sendSocketNotification("MMM_WordGenius_GetWord", {
			config: this.config
		});
	},
	
	socketNotificationReceived: function (notification, payload) {
		console.log("WordGenius-Got notification" + notification);
		if (notification === "MMM_WordGenius_Result") {
			console.log("WordGenius-Got notification");
			console.log(payload);
			this.dataNotification = payload;
			this.updateDom(self.config.animationSpeed);
		}
	},

	// Override dom generator.
	getDom: function() {
		console.log("WordGenius-GetDOM");
		var wrapper = document.createElement("div");
		wrapper.setAttribute('class', 'wordgenius');

		var wotd = document.createElement("div");
		wotd.setAttribute('class', 'wordgenius-title');
		
		var headerLabel = document.createElement("header");
		headerLabel.setAttribute('class', 'wordgenius-header module-header');
		headerLabel.innerHTML = "<span>" + this.config.headerText + "</span>";
		
		var partOfSpeech = document.createElement("span");
		partOfSpeech.setAttribute('class', 'wordgenius-partofspeech');

		var pronunciation = document.createElement("span");
		pronunciation.setAttribute('class', 'wordgenius-pronunciation');

		var origin = document.createElement("span");
		origin.setAttribute('class', 'wordgenius-origin');

		var definition = document.createElement("span");
		definition.setAttribute('class', 'wordgenius-definition');

		console.log("WordGenius-using object:");
		console.log(this.dataNotification);
		if (this.dataNotification) {
			wotd.innerHTML = this.dataNotification.word;
			partOfSpeech.innerHTML = this.dataNotification.partOfSpeech + "&nbsp;&middot;&nbsp;";
			pronunciation.innerHTML = this.dataNotification.pronunciation + "&nbsp;&middot;&nbsp;";
			origin.innerHTML = this.dataNotification.origin;

			var defs = this.dataNotification.definitions;
			var def = defs[0];
			def = def.replace("\n", "<br>");
			definition.innerHTML = def;
		}
		wrapper.appendChild(headerLabel);
		wrapper.appendChild(wotd);
		wrapper.appendChild(partOfSpeech);
		wrapper.appendChild(pronunciation);
		wrapper.appendChild(origin);
		wrapper.appendChild(definition);
		return wrapper;
	},
});
