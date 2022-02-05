# MMM-WordGenius
Magic Mirror Module to show the Word of the Day from the WordGenius.com website. This module does NOT require the user to enter any external API keys or secrets.

You may need to tweak the css styling to fit your mirror. Mine runs on a VERY low resolution, but very W I D E monitor
(a weird commercial unit), so it might look a bit off for other cases.

Enjoy the module :)


# Screenshot
![Image of WordGenius Word of the Day Module](MMM-WordGenius.jpg)


# Installation
```
cd ~/MagicMirror/modules
git clone https://github.com/drventure/MMM-WordGenius.git
cd MMM-WordGenius
npm install
```

## Add to config:
```
module: 'MMM-WordGenius',
position: 'top_right',
config: {
	updateInterval: 120000,
	headerText: "Word Genius Word of the Day"
}
```

### Thanks To:
This module is based off of the Word of the Day module written by @jmwyds.
