window.onload = onloadFunction;

var Player = function(div,i,config){
	
				this.i = i;
				this.div = div;
				if(config.Width < 300){ config.Width = 300;}
				this.config = config;
				this.ctrlElements = ["Toggle","Slider","Full","Vol","Duration","Current"];
		};
		
		Player.prototype = {
				
					adObject: null,
					adsManager: null,
					adPlaying: false,
					adPaused: false,
					controls: null,
					toggle: null,
					slider: null,
					vol: null,
					current: null,
					duration: null,
					full: null,
					video: null,
					i: null,
					div: null,
					config: null,
					videoEvents: ["click",
							"dblclick",
							"mouseover",
							"mouseout",
							"keydown",
							"load",
							"abort",
							"canplay",
							"canplaythrough",
							"change",
							"durationchange",
							"emptied",
							"ended",
							"error",
							"loadeddata",
							"loadedmetadata",
							"loadstart",
							"pause",
							"play",
							"playing",
							"progress",
							"ratechange",
							"seeked",
							"seeking",
							"stalled",
							"suspend",
							"timeupdate",
							"volumechange",
							"waiting"],	
				
		
		init: function(){
			
			
			this.initVideo();
			this.initControls();
			this.playerSize();
			
			return this;
		},
		
		/**
		 * This methos sets dimensions of player
		 */
		playerSize: function(){
			
			if(this.config.Width == undefined){
				
				this.div.style.width = "500px";
				this.video.style.width = "500px";
				this.controls.style.width = "500px";
				this.slider.style.width = 500 - (this.ctrlElements.length-1)*45;
				this.slider.childNodes[0].style.width = parseInt(this.slider.style.width) - 10;
			}else{
				
				this.div.style.width = this.config.Width;
				this.video.style.width = this.config.Width;
				this.controls.style.width = this.config.Width;
				this.slider.style.width = (this.config.Width - 10) - (this.ctrlElements.length-1)*45;
				this.slider.childNodes[0].style.width = parseInt(this.slider.style.width) - 10;
			}
			
			
			if(this.config.Height == undefined){
				
				this.div.style.height = "240";
				this.video.style.height = "210";
			}else{
				
				this.div.style.height = this.config.Height;
				this.video.style.height = this.config.Height;
			}

		},
		
		/**
			Creating controls div (array specifies what elements will div contain)
			This is array when every element is called:
			arr = ["Toggle","Current","Duration","Full","Vol"];
		*/	
		initControls: function(){
		
			this.ctrlElements = this.checkControls(this.ctrlElements);
			this.controls = this.Controls.create(this.ctrlElements,this.i);
			
			this.toggle = this.Controls.toggle;
			this.slider = this.Controls.slider;
			this.current = this.Controls.current;
			this.duration = this.Controls.duration;
			this.vol = this.Controls.vol;
			this.full = this.Controls.full;
			this.div.appendChild(this.controls);	
		},
		
		
		/**
				Creating video element and assigning it event listeners
		*/		
		initVideo: function(){
		
			var video = this.Video.create(this.config,this.i);
			this.div.appendChild(video);
			this.div.insertBefore(video, this.div.childNodes[0]);
			this.video = video;
			
			this.assignListeners(this.video,this.videoEvents);	
		},
		
		/**
		 * Check config object for aditional player properties
		 * 
		 */
		checkControls: function(ctrlElements){
			
			var cnfg = [];

			if(this.config.Toggle == false){
				var index = ctrlElements.indexOf("Toggle");
				ctrlElements.splice(index,1);
			}
			if(this.config.Slider == false){
				var index = ctrlElements.indexOf("Slider");
				ctrlElements.splice(index,1);
			}
			if(this.config.Full == false){
				var index = ctrlElements.indexOf("Full");
				ctrlElements.splice(index,1);
			}
			if(this.config.Vol == false){
				var index = ctrlElements.indexOf("Vol");
				ctrlElements.splice(index,1);
			}
			if(this.config.Time == false){
				var index = ctrlElements.indexOf("Duration");
				ctrlElements.splice(index,2);
			}

			return ctrlElements;
		},

		/*
		 * 
		 * api-s for player
		 */
		insertVideo: function(){
			
			var source1 = document.createElement("source");
			source1.src = this.config.name;
			var extension = this.config.name.substr(this.config.name.indexOf('.')+1);
			source1.type = "video/"+extension;

			var source2 = document.createElement("source");
			source2.src = this.config.name.substring(0, this.config.name.length - 3) +"ogg";

			source2.type = "video/ogg";
			this.video.appendChild(source1);
			this.video.appendChild(source2);
		},
		
		play: function(){
			
			if(this.video.childNodes.length == 0){
				
				this.video.style.backgroundImage = "";
				
				if(this.adObject == null){
					this.adObject = new Ads(this);
					this.adObject.init();
				}
				
			}
	
			if(this.video.paused){
					this.video.play();
					this.toggle.innerHTML = "<img style='height: 30px; width: 40px; cursor: pointer;' src='pause.png'/>";
				}else{
					console.log("Player is already playing!");
			}

		},
		
		pause: function(){

			
			if(!this.video.paused){
				this.video.pause();
				this.toggle.innerHTML = "<img style='height: 30px; width: 40px; cursor: pointer;' src='play.png'/>";
			}else{
				console.log("Player is already paused!");
			}	
		},
		
		ended: function(){
			
			this.toggle.innerHTML = "<img style='height: 30px; width: 40px; cursor: pointer;' src='play.png'/>";
			this.slider.childNodes[1].style.left = 0;
		},
		
		fullscreen: function(){
	
			if (this.video.mozRequestFullScreen) {
				this.video.mozRequestFullScreen();
			} else if (this.video.webkitRequestFullScreen) {
				this.video.webkitRequestFullScreen();
			}
		},
		
		
		timeUpdate: function(){
			
			var cursor = this.slider.childNodes[1];
			var bar = this.slider.childNodes[0];
			var start = bar.offsetLeft;
		    var end = start +  bar.offsetWidth - 20;
		    var percent = (end - start) / 100;
		    var time = this.video.currentTime * (100/this.video.duration);
			var len = Math.round(time*percent);
			cursor.style.left = len;
			var curTime = this.current;
			var durTime = this.duration;	
				var minsC = Math.floor(this.video.currentTime/60);
				var secsC = Math.floor(this.video.currentTime - minsC * 60);
				var minsD = Math.floor(this.video.duration/60);
				var secsD = Math.round(this.video.duration - minsD * 60);
				if(secsC < 10){
					secsC = "0" + secsC;
				}
				if(secsD < 10){
					secsD = "0" + secsD;
				}
				curTime.innerHTML = minsC + ":" + secsC + "/";
				durTime.innerHTML = minsD + ":" + secsD;
		},

		
		clickSlider: function(){

			var cursor = this.slider.childNodes[1];
			var bar = this.slider.childNodes[0];
		    var xPosition = event.clientX;
		    cursor.style.left = xPosition - bar.parentNode.offsetLeft - 12;
		    var start = bar.offsetLeft;
		    var end = start + bar.offsetWidth;
		    var current = cursor.offsetLeft + 7 - start;
		    var percent = (start + bar.offsetWidth - bar.offsetLeft) / 100;
		    var seekto = this.video.duration/100 * current/percent;
			this.video.currentTime = seekto;
		},
		
		dragSlider: function(){
			
			var bar = this.slider.childNodes[0];
			var cursor = this.slider.childNodes[1];				
			var xPosition = event.clientX;				
			cursor.style.left = xPosition - bar.parentNode.offsetLeft;			    		    
		    var start = bar.offsetLeft;
		    var end = start + bar.offsetWidth;			    
		    var current = cursor.offsetLeft + 7 - start;	
		    var percent = (end - start) / 100;			    
		    var seekto = this.video.duration/100 * current/percent;
			this.video.currentTime = seekto;
		},
		
		clickVol: function(e){
			
			var cursor = this.vol.childNodes[1];
			var bar = this.vol.childNodes[0];

			var start = bar.offsetLeft;
		    var end = start +  bar.offsetWidth - 20;
		    
		    var percent = 0.5;
			
		    var xPosition = e.clientX;
		    cursor.style.left = xPosition - bar.parentNode.offsetLeft - 52;
		    
		    var current = cursor.offsetLeft + 6 - start;
		    
			var vlm = current/percent/100;
			if(vlm < 0){vlm=0; cursor.style.left = xPosition - bar.parentNode.offsetLeft - 3;}
			this.video.volume =vlm;
			
		},
		
		dragVol: function(e){

			var cursor = this.vol.childNodes[1];
			var bar = this.vol.childNodes[0];

			var start = bar.offsetLeft;
		    var end = start +  bar.offsetWidth - 20;
		    
		    var percent = 0.5;
			
		    var xPosition = e.clientX;
		    cursor.style.left = xPosition - bar.parentNode.offsetLeft - 52;
		    
		    var current = cursor.offsetLeft + 6 - start;
		    
			var vlm = current/percent/100;
			if(vlm > 1){vlm=1;}
			if(vlm < 0){vlm=0;}
			this.video.volume =vlm;	

		},
		
		
		/**
			Assigning event listeners to element
		*/
		assignListeners: function(element,eventArr){
		
			for(var j in eventArr){
				element.addEventListener(eventArr[j], this.Events.callEvent);
			}
		},
		
		/**
			When event occurs Events.callEvent
		*/
		Events : {
			
	
		/**
			Calls function depending on event that has occurred
		*/
			callEvent : function(e){

				try{
					Player.prototype.Events["video_"+e.type].call(this, e);
				}catch(err){
					//console.error(e.type);
				}
	
			},
			
			video_ended: function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				var player = Players.getPlayer[id];
				
				player.ended();
			},
	
			/**
				What happens when double click occurs
			*/
			video_dblclick : function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				var player = Players.getPlayer[id];
				player.fullscreen();
			},
			
			/**
				What happens when click occurs
			*/
			
			//for video
			video_click : function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				var player = Players.getPlayer[id];
					if(player.video.paused){
						player.play(player);
					}else{
						player.pause(player);
					}
			},
			
			//for toggle button	
			toggle_click: function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				var player = Players.getPlayer[id];
				

				/*
				 * Checking if ad is on
				 * if it is on toggle button will control ad, otherwise it will control video element
				 */
				if(player.adPlaying){
					
					
					if(player.adPaused){
						player.adPaused = false;
						player.adObject.PlayAd();
					}else{
						player.adObject.PauseAd();
						player.adPaused = true;
					}
					
				}else{
					
						if (player.video.paused){ 
							player.play(); 
						}else{ 
							player.pause(); 
						}
				}
				
			},
			
			//for full screen button	
			full_click : function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				var player = Players.getPlayer[id];
				
				if(player.adPlaying){		
					player.adObject.fullscreenAd();
				}else{
					player.fullscreen();
				}
				
			},

			video_timeupdate : function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				player = Players.getPlayer[id];
				
				if(player.adPlaying === false){
					player.timeUpdate();
				}
			},
			
			clickSlider: function(event){
				
				var id = parseInt(this.getAttribute("data-id"));
				player = Players.getPlayer[id];
				player.clickSlider();

			},
			
			dragSlider: function(event){
				
				var id = parseInt(this.getAttribute("data-id"));
				player = Players.getPlayer[id];
				player.dragSlider();
			},
			
			clickVol: function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				player = Players.getPlayer[id];
				
				if(player.adPlaying){
					player.adObject.clickVolAd(e);
				}else{
					player.clickVol(e);
				}
			},
			
			dragVol: function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				
				player = Players.getPlayer[id];
				
				if(player.adPlaying){
					player.adObject.dragVolAd(e);
				}else{
					player.dragVol(e);
				}

			}
			
			
		},

		Video: {

			create: function(config,id){
				
				var video = document.createElement("video");
				video.style.backgroundImage="url("+config.snapshot+")";
				video.style.width = 500;
				video.style.height = 210;
				video.style.position = "absolute";
				video.setAttribute("data-id",id);
				video.id = "video"+id;
				return video;
			}
		
		},	

		/**
			Div with all controls for video
		*/
		Controls: {

			video: null,
			toggle: null,
			slider: null,
			vol: null,
			current: null,
			duration: null,
			full: null,
			i: null,
			arr: null,

			/**
				Method that creates div
			*/
			create: function(arr,i){
			
				this.i = i;
				this.arr = arr;
				
				var controls = document.createElement("div");
				controls.id = "controls"+i;
				controls.setAttribute("style","background-color: #ccc; width: 500; height: 30; position: absolute; bottom: 0;");
				Player.prototype.controls = controls;
				
				for(var j in arr){
					Player.prototype.Controls["add"+arr[j]].call(this);
				}
				
				return controls;
			},		
			
			addToggle: function(){
				
				
				var toggle = document.createElement("div");
				toggle.id = "toggle"+this.i;
				toggle.setAttribute("data-id",this.i);
				toggle.setAttribute("style","display: inline-block; width: 50;");
				Player.prototype.controls.appendChild(toggle);			
				toggle.innerHTML = "<img style='height: 30px; width: 40px; cursor: pointer;' src='play.png'/>"
				toggle.addEventListener("click",Player.prototype.Events.toggle_click);
				this.toggle = toggle;
			},
			
			addSlider: function(){
				
				var slider = document.createElement("div");
				var progres = Player.prototype.Controls.ProgresBar;
				var bar = progres.bar("seekBar");
				bar.setAttribute("style"," height: 10; position: absolute; background-color: red; margin: 4 5; border: solid 1px;");
				bar.addEventListener("click",Player.prototype.Events.clickSlider);
				bar.addEventListener("dragover",Player.prototype.Events.dragSlider);

				slider.appendChild(bar);
				var cursor = progres.cursor("seekCursor");
				cursor.setAttribute("style","width: 20; height: 20; position: relative; background-color: blue; border-radius: 100%; margin: 0 5; cursor: pointer; opacity: 0.8;");
				slider.appendChild(cursor);
				slider.setAttribute("style","display: inline-block;");

				Player.prototype.controls.appendChild(slider);
				
				this.slider = slider;
					
			},

			addCurrent: function(){
				
				current = this.Span.create();
				current.id = "current"+this.i;
				current.setAttribute("style","display: inline-block; width: 40; float: right;");
				current.setAttribute("data-id",this.i);
				
				Player.prototype.controls.appendChild(current);
				current.innerHTML = "0:00/";
				this.current = current;
			},
				
			addDuration: function(){
				
				var duration = this.Span.create();
				duration.id ="duration"+this.i;
				duration.setAttribute("data-id",this.i);
				duration.setAttribute("style","display: inline-block; width: 35; float: right;");
				Player.prototype.controls.appendChild(duration);
				duration.innerHTML = "0:00";
				this.duration = duration;
			},

			addVol: function(){
			
				var vol = document.createElement("div");
				var progres = Player.prototype.Controls.ProgresBar;
				var bar = progres.bar("volumeBar");
				bar.setAttribute("style","width: 100%; height: 5; position: absolute; background-color: gray; margin: -13 5; border: solid 1px;");
				vol.appendChild(bar);
				bar.addEventListener("click",Player.prototype.Events.clickVol);
				bar.addEventListener("dragover",Player.prototype.Events.dragVol);
				
				var cursor = progres.cursor("volumeCursor");
				cursor.setAttribute("style","width: 7; height: 12; position: relative; background-color: black;  margin: -15 45; cursor: pointer; opacity: 0.8;");
				vol.appendChild(cursor);
				vol.setAttribute("style","display: inline-block; width: 45;");
				vol.childNodes[0].style.width = parseInt(vol.style.width);
				
				Player.prototype.controls.appendChild(vol);
				
				this.vol = vol;
			},
			
			addFull: function(){
				
				var full = document.createElement("div");
				full.id = "full"+this.i;
				full.setAttribute("data-id",this.i);
				full.setAttribute("style","display: inline-block; width: 35; float: right; cursor: pointer;");
				full.innerHTML = "<img style='height: 30px; width: 35px;' src='full.png'/>"
				Player.prototype.controls.appendChild(full);
				full.addEventListener("click",Player.prototype.Events.full_click);
				this.full = full;
			},


			/**
				All Elements/Objects that MenuObj uses
			*/
			Span: {
			
				create: function(){
					var span = document.createElement("span");
					return span;
				}
			},
			

			ProgresBar: {
					
				bar: function(name){
						
					var bar = document.createElement("div");
					var id = Player.prototype.Controls.i;
					bar.id = name+id;
					bar.setAttribute("data-id",id);
						
					return bar;					
				},
					
				cursor: function(name){
						
					var id = Player.prototype.Controls.i;
						
					var cursor = document.createElement("div");
					cursor.id = name+id;
					cursor.setAttribute("data-id",this.i);
					cursor.draggable = true;
						
					return cursor;
				}
			
			}
	}
	
}
		
		
		
Ads = function(player){
			
	this.player = player;
}

Ads.prototype = {
		
		adsLoader: null,
		player: null,
		
		/**
		 * 
		 * initializes Ad and gives it events
		 */
		init: function(){

			var container = this.createAdContainer();
			var adsLoader = this.createAdsLoader(container,this.player.i);
			adsLoader.player = this.player;
			this.adsLoader = adsLoader;
			this.adsLoaderEvents(adsLoader);
			this.requestAd(adsLoader);

		},
		
		
		/**
		 * creates container (iframe) for ad
		 * @param i - players id
		 * @returns - adDisplayContainer
		 */
		createAdContainer: function(){

			var videoContent = this.player.video;
			var adDisplayContainer = new google.ima.AdDisplayContainer(Element.byClass("adContainer")[this.player.i], videoContent);
			// Must be done as the result of a user action on mobile
			adDisplayContainer.initialize();
			
			return adDisplayContainer;
			
		},
		
		
		/**
		 * creates adsLoader object and gives it myId field
		 * @param adDisplayContainer - iframe that contains ad
		 * @param i - players id
		 * @returns adsLoader 
		 */
		createAdsLoader: function(adDisplayContainer){
			
			var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
			adsLoader.myId = this.player.i;

			return adsLoader;
		},
		
		
		/**
		 *  ads events for adsLoader, creates adsManager, ads events for adsManager
		 * @param adsLoader
		 * @returns //
		 */
		adsLoaderEvents: function(adsLoader){
			
			//Add event listeners
			
			onAdsManagerLoaded = this.onAdsManagerLoaded;
			onAdError = this.onAdError;
			
			adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded,false);
			
			adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError,false);

		},
		
		
		requestAd: function(adsLoader){
			
			var player = Players.getPlayer[adsLoader.myId];
			
			//Request video ads.
			var adsRequest = new google.ima.AdsRequest();
			adsRequest.adTagUrl = player.config.adTagUrl;

			//Specify the linear and nonlinear slot sizes. This helps the SDK to
			//select the correct creative if multiple are returned.
			adsRequest.linearAdSlotWidth = 500;
			adsRequest.linearAdSlotHeight = 210;
			adsRequest.nonLinearAdSlotWidth = 500;
			adsRequest.nonLinearAdSlotHeight = 210;

			adsLoader.requestAds(adsRequest);
		},
		
		
		onAdsManagerLoaded: function(adsManagerLoadedEvent) {

			var videoContent = this.player.video;
			// Get the ads manager.
			adsManager = adsManagerLoadedEvent.getAdsManager(videoContent);  // See API reference for contentPlayback
			// Add listeners to the required events.
			adsManager.myId = this.myId;
			adsManager.player = this.player;
			this.adsManager = adsManager;
			
		//	console.log("parent: ",this.adsManager.parentNode.nodeName);
			
			
			adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.player.adObject.onAdError);				
			adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.player.adObject.onContentPauseRequested);				
			adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,this.player.adObject.onContentResumeRequested);
			adsManager.addEventListener(google.ima.AdEvent.Type.STARTED,  this.player.adObject.onStart);
			adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, this.player.adObject.onSkiped);
			adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, this.player.adObject.onPause);				
			adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, this.player.adObject.onResume);				
			adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.player.adObject.onCompleted);

			try {
				// Initialize the ads manager. Ad rules playlist will start at this time.
				adsManager.init(videoContent.style.width, videoContent.style.height, google.ima.ViewMode.NORMAL);
				// Call start to show ads. Single video and overlay ads will
				// start at this time; this call will be ignored for ad rules, as ad rules
				// ads start when the adsManager is initialized.
				adsManager.start();
				this.player.toggle.innerHTML = "<img style='height: 30px; width: 40px; cursor: pointer;' src='pause.png'/>";
			} catch (adError) {
				// An error may be thrown if there was a problem with the VAST response.
			}
			
		},
		
		
		onContentPauseRequested: function() {
			// This function is where you should setup UI for showing ads (e.g.
			// display ad timer countdown, disable seeking, etc.)		

			
			this.player.video.removeEventListener('ended', this.player.adObject.contentEndedListener);
			this.player.pause();
			
			console.log(this);
			
		},
		
		onContentResumeRequested: function() {
			
			// This function is where you should ensure that your UI is ready
			// to play content.
			this.player.video.addEventListener('ended', player.adObject.contentEndedListener);
			this.player.video.play();
			this.player.toggle.innerHTML = "<img style='height: 30px; width: 40px; cursor: pointer;' src='pause.png'/>";
		},
		
		
		//An event listener to tell the SDK that our content video
		//is completed so the SDK can play any post-roll ads.
		//contentEndedListener: function() { },
		
		
		/**
		 * 
		 * events for adsLoader
		 */
		
		
		
		onAdError: function(adErrorEvent) {
			// Handle the error logging and destroy the AdsManager
			console.log(adErrorEvent.getError());
			adsManager.destroy();
		},
		
		
		/**
		 * 
		 * Next 7 functions are the ones that were set in adsManager's eventListeners
		 * 
		 * 
		 */

			onSkiped: function(){

				this.player.adPlaying = false;
				this.player.slider.childNodes[0].style.backgroundColor = "red";
				
				
				if(this.player.video.childNodes.length == 0){
					
					this.player.insertVideo();
					this.player.play();
				}
			},

			onStart: function(){

				this.player.adPlaying = true;
				this.player.adPaused = false;
				this.player.slider.childNodes[0].style.backgroundColor = "yellow";
				this.player.adObject.onCountdownAd(this.player);
				this.player.toggle.innerHTML = "<img style='height: 30px; width: 40px; cursor: pointer;' src='pause.png'/>";
			},
			
			onPause: function(){
				
				this.player.adPaused = true;
			},
			
			onResume: function(){

				this.player.adPaused = false;
			},
			
			onCompleted: function(){

				this.player.adPlaying = false;
				this.player.slider.childNodes[0].style.backgroundColor = "red";
				
				
				if(this.player.video.childNodes.length == 0){
					
					this.player.insertVideo();
					this.player.play();
				}
			},
		
		
		/**
		 * method for playing ad
		 * @param i - players id
		 * @returns //
		 */
		PlayAd: function(){
				
			this.adsLoader.adsManager.resume();
			this.player.toggle.innerHTML = "<img style='height: 30px; width: 40px; cursor: pointer;' src='pause.png'/>";

		},
		
		/**
		 * method for pausing ad
		 * @param i - players id
		 * @returns //
		 */
		PauseAd: function(){

			this.adsLoader.adsManager.pause();
			this.player.toggle.innerHTML = "<img style='height: 30px; width: 40px; cursor: pointer;' src='play.png'/>";
		},
		
		
		
		fullscreenAd: function(){
			
			console.log("fullscreen is in progres");
			
		/*	var player = Players.getPlayer[i];
			var manager = player.adsManager;
			var fullscreenWidth = window.screen.width;
			var fullscreenHeignt = window.screen.height;
			
			manager.resize(fullscreenWidth, fullscreenHeignt, google.ima.ViewMode.FULLSCREEN);
		*/
		},
		
		/**
		 * 
		 * method for clicking on volume bar
		 * @param e -> event
		 * @param i -> players id
		 * @returns //
		 */
		clickVolAd: function(e){

			
			var cursor = this.player.vol.childNodes[1];
			var bar = this.player.vol.childNodes[0];

			var start = bar.offsetLeft;
		    var end = start +  bar.offsetWidth - 20;
		    
		    var percent = 0.5;
			
		    var xPosition = e.clientX;
		    cursor.style.left = xPosition - bar.parentNode.offsetLeft - 52;
		    
		    var current = cursor.offsetLeft + 6 - start;
		    
			var vlm = current/percent/100;
			if(vlm < 0){vlm=0; cursor.style.left = xPosition - bar.parentNode.offsetLeft - 3;}
			this.adsLoader.adsManager.setVolume(vlm);
			
		},
		
		/**
		 * method for draging volume cursor
		 * @param e - event listener
		 * @param i - players id
		 * @returns //
		 */
		dragVolAd: function(e){

			var cursor = this.player.vol.childNodes[1];
			var bar = this.player.vol.childNodes[0];

			var start = bar.offsetLeft;
		    var end = start +  bar.offsetWidth - 20;
		    
		    var percent = 0.5;
			
		    var xPosition = e.clientX;
		    cursor.style.left = xPosition - bar.parentNode.offsetLeft - 52;
		    
		    var current = cursor.offsetLeft + 6 - start;
		    
			var vlm = current/percent/100;
			if(vlm > 1){vlm=1;}
			if(vlm < 0){vlm=0;}
			this.adsLoader.adsManager.setVolume(vlm);

		},
		
		/**
		 * works as onTimeUpdate listener on video
		 * time is updated on 1000 ms
		 * @param i - players id
		 * @returns //
		 */
		
		countdownTimer: null,
		
		onCountdownAd: function(player) {
			
			//console.log(this ," adPlaying: ", player.adPlaying , " adPaused: ", this.player.adPaused);
			
			var manager = this.adsLoader.adsManager;
			var duration = manager.getCurrentAd().getDuration();
			var curTime = player.current;
			var durTime = player.duration;	
			var cursor = this.player.slider.childNodes[1];
			var bar = player.slider.childNodes[0];
			var adPlaying = player.adPlaying;
			var adPaused = player.adPaused;
			
			bar.removeEventListener("click",player.Events.clickSlider);
			bar.removeEventListener("dragover",player.Events.dragSlider);
			
			var start = bar.offsetLeft;
		    var end = start +  bar.offsetWidth - 20;
		    var percent = (end - start) / 100;
		    
		  
			this.countdownTimer = setInterval(function() {		
				
				
//				console.log(player);
//
//				console.log("ad playing: for player number: ", this.player.i , " result is: ",adPlaying);
				
				
				if(player.adPlaying){
					
					var currentTime = duration - Math.round(manager.getRemainingTime()) +1;
					var time = currentTime * (100/duration);
					var len = Math.round(time*percent);
					cursor.style.left = len;
					
					var minsC = Math.floor(currentTime/60);
					var secsC = Math.floor(currentTime - minsC * 60);
					var minsD = Math.floor(duration/60);
					var secsD = Math.round(duration - minsD * 60);
					if(secsC < 10){
						secsC = "0" + secsC;
					}
					if(secsD < 10){
						secsD = "0" + secsD;
					}
					curTime.innerHTML = minsC + ":" + secsC + "/";
					durTime.innerHTML = minsD + ":" + secsD;

				}else{
					 bar.addEventListener("click",player.Events.clickSlider);
					 bar.addEventListener("dragover",player.Events.dragSlider);
					 player.adObject.stopCountdownTimer();
				}
			}, 1000);
		},
		
		stopCountdownTimer: function(){
			clearInterval(this.countdownTimer);
		}
		
}

/*
 * 
 * Object for creating instances of player
 */
Players = {
		
		getPlayer: [],
		
		init: function(){
			
			var playerDivs = this.findAllPlayers();
			
			for(var i=0; i<playerDivs.length; i++){
				
				var Url = 'http://pubads.g.doubleclick.net/gampad/ads?' +
				 'sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&' +
				 'impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&' +
				 'url=[referrer_url]&correlator=[timestamp]';
				
				this.getPlayer[i] = new Player(playerDivs[i], i, {Toggle: true, Full: true, Vol: true, Time: true, Slider: true, name: "test.mp4", snapshot : "snapshot.png", adTagUrl: Url}).init();
			}
			
		},

		
		findAllPlayers: function(){
			
			var n = Element.byClass("player");
			
			return n;
		}
}



/**
object with functions for getting elements 
*/
var Element = {
	byClass: function(className){
		return document.getElementsByClassName(className);
	},
	
	byId: function(id){
		return document.getElementById(id);
	},
	
	byTag: function(tag){
		return document.getElementsByTagName(tag);
	}
}

/**
	Function that specifies what will happen when page is loaded
*/
function onloadFunction(){
	
	Players.init();
}