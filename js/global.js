//Global variables
//////////////////////////////////////////////////////////////////////////////////////	
var global={
	// Timeouts
	timeouts:{
		tvPictureShake1:null,
		tvPictureShake2:null
	},
	
	// Settings
	settings:{
		contactLinkSelectedClass:'contactLinkSelected',
		loadingClass:'loading',
		animationSpeed:600,
		imageDirectory:'http://johncollinson.info/img/'
	},
	
	// Page objects/config
	currentPage:null,
	pages:{
		aboutMe:{id:1,name:'aboutme',tvImagePath:'tvfront.png'},
		myProjects:{id:2,name:'projects',tvImagePath:'tvleft.png'},
		myCv:{id:3,name:'mycv',tvImagePath:'tvright.png'}
	},
	
	// Ajax services
	services:{
		getPage:'php/getpage.php',
		sendMessage:'php/sendmessage.php'
	},
	
	// Selectors
	select:{
		container:'#container',
		header:'#header',
		headerTv:'#headerTv',
		tvPictureContainer:'#tvPictureContainer',
		tvBackground:'.tvBackground',
		footer:'#footer',
		content:'#content',
		contentMenu:'#contentMenu',
		contentMenuSelected:'.selected',
		contentMenuLinks:'#contentMenu li a',
		contentBodyContainer:'#contentBodyContainer',
		contentBody:'#contentBody',
		contactLink:'.contactLink a',
		contactForm:'#contactForm',
		button:'.button',
		loading:'#loading'
	},
	
	// UI
	page:{
		// Binds
		bind:{
			ui:function(){
				this.contentMenu_click();
				this.contactLink_click();
				this.contactForm_submit();
			},
			
			contactForm_submit:function(){
				$(global.select.contactForm).submit(function(){
					global.hlp.sendEmail($(this));
					return false;
				});
			},
			
			contactLink_click:function(){
				$(global.select.contactLink).click(function(){
					global.hlp.toggleContactFormSlide($(this));				
				});
			},
			
			contentMenu_click:function(){
				$(global.select.contentMenuLinks).not(global.select.contactLink).click(function(evt){					
					evt.preventDefault();
					if(!$(this).hasClass('selected')){
						global.hlp.managePageChange($(this));
					}
				});	
			}
		},
		
		//Registration
		register:{			
			button:function(){
				$(global.select.button).button();
			},
			
			tvPictureShake:function(){
				// Clear the timeouts
				clearTimeout(global.timeouts.tvPictureShake1);
				clearTimeout(global.timeouts.tvPictureShake2);
				
				// Grab element
				$tvPicture=$(global.select.tvPictureContainer).find('img');
				
				// function to shake the image
				var shake=function(callback){
					$tvPicture.effect('shake',{distance:3,times:3},50, callback);	
				};

				// Check the tv picture is on the page
				if($tvPicture.length>0){
					// fade down the picture
					$tvPicture.animate({opacity:'0.4'},150,function(){
						// Shake it one
						shake(null);
						
						// Next shake in half a second
						global.timeouts.tvPictureShake1=setTimeout(function(){ 
							// Set function to end the animation
							var endShake=function(){ 
								// Fade the picture up
								$tvPicture.animate({opacity:'1'},250,function(){
									global.timeouts.tvPictureShake2=setTimeout(function(){
										// Set the shake again
										global.page.register.tvPictureShake();	
									},5000);
								});
							};
							
							// Shake it twice
							shake(endShake);
						},500);
					});
				}
			}
		}
	},
	
	// Helpers
	hlp:{
		// Configure the page inc menu, tv, setting global variables etc
		configurePage:function(pageObj){
			// Hide the contact form
			$(global.select.contactForm).hide();
			
			// See if this is the first page load, if not we need to update the menu and tv
			if(global.currentPage!=null){
				// Update the menu
				global.hlp.updateMenu(pageObj.id);
			
				// Update the tv
				global.hlp.updateTv(pageObj.tvImagePath);
			}
			
			// Set the current page
			global.currentPage=pageObj;
		},				
		
		// Update the tv on page change or load
		updateTv:function(newImagePath){		
			// Get current tv element
			var $tvContainer=$(global.select.headerTv);
			var $tvPictureContainer=$tvContainer.children(global.select.tvPictureContainer);
			
			// Create the new image element
			var $newImage=$('<img />').attr('src', global.settings.imageDirectory + newImagePath);
			
			// Get current image element
			$currentImage=$tvPictureContainer.find('img');								
																
			// Create load event to remove current image and show the new
			$newImage.load(function(){
				// Manage fade outs/ins
				$currentImage.fadeOut(global.settings.animationSpeed,function(){
					$(this).remove();
					
					$newImage.fadeIn(global.settings.animationSpeed);
				});
			});
			
			// Hide the element weve created and append to container
			$tvPictureContainer.append($newImage.hide());
		},
		
		// Update the menu on page change or load
		updateMenu:function(makeSelectedId){
			// Get element
			var $contentMenu=$(global.select.contentMenu);
			
			// Clear all selected classes from menu
			$contentMenu.find('a').removeClass('selected').removeClass('contactLinkSelected');
			
			// Get element
			var $current_a=$contentMenu.find('#' + global.currentPage.id);
	
			// Remove h1 from currently selected menu item						
			var currentText=$current_a.find('h1').html();
			$current_a.empty().html(currentText);
			
			// Add the selected class onto the new item
			var $new_a=$contentMenu.find('#' + makeSelectedId);
			$new_a.addClass('selected');
			
			// Add the h1 onto the new item
			var newText=$new_a.html();
			$new_a.html('').append($('<h1 />').html(newText));
		},				
		
		// Manage a page change request from a menu click
		managePageChange:function($clickedMenuItem){						
			// Get the page were chaging too
			var newPage=this.getPageForId($clickedMenuItem.attr('id'));
			
			// Configure the page with the settings of what we've clicked on
			global.hlp.configurePage(newPage);
			
			// Show loading symbol next to link
			$selectedLink=$(global.select.contentMenu).find('a' + global.select.contentMenuSelected)
			$selectedLink.addClass(global.settings.loadingClass);
			 
			// Do ajax request			
			$.ajax({
					type:'POST',
					url:global.services.getPage,
					data:{page:newPage.name},
					success:function(response){ 
						// Do the animation
						global.hlp.animatePageChange(response);
						
						// Hide loading
						$selectedLink.removeClass(global.settings.loadingClass);
					},
					error:function(response){
						// Hide loading
						$selectedLink.removeClass(global.settings.loadingClass);
						
						// Show error
						alert('Sorry, something\'s gone wrong contacting the server. Please try again');
					}
			});
		},
		
		// Animate the page transition
		animatePageChange:function(newPageHtml){
			// Set a fixed height on the container
			var $container = $(global.select.contentBodyContainer);
			$container.css('height', $container.height());
			
			// Slide page out to the right
			$(global.select.contentBody).css('position', 'absolute').animate({left:'550px'}, global.settings.animationSpeed, function() {
				// Remove current content
				$(this).children().remove();
				
				// Set the left css position ready to slide in from the other side
				$(this).css('left', '-550px');
				
				// Append new content
				var $page = $('<div />').html(newPageHtml);
				$(this).append($page.html());
				
				// Slide new page in from the left
				$(this).animate({left:'0px'}, global.settings.animationSpeed, function() { 
					// Reset container height back to auto
					$container.css('height', 'auto');
					
					// Remove absolute positioning of content body
					$(this).css('position', 'initial');
				});
			});
		},
		
		// Gets a page based on the id
		getPageForId:function(id) {
			var returnPage={};
			for(var i in global.pages) {
				if(global.pages[i].id==id){
					returnPage=global.pages[i] ;
					break;	
				}
			}
			return returnPage;
		},
		
		// Sets the current page on load
		getCurrentPageOnLoad:function(){
			var url = document.URL;
			for(var i in global.pages) {
				if(url.indexOf(global.pages[i].name)!='-1'){
					return global.pages[i];
				}
			}
			
			return global.pages.aboutMe;
		},
		
		// Opens or closes the contact form
		toggleContactFormSlide:function($link){
			if(!$link.hasClass(global.settings.contactLinkSelectedClass)){
				$(global.select.contactForm).show('slide', global.settings.animationSpeed);;
				$link.addClass(global.settings.contactLinkSelectedClass);
			} else {
				$link.removeClass(global.settings.contactLinkSelectedClass);				
				$form=$(global.select.contactForm);		
				$form.slideUp(global.settings.animationSpeed, function(){
					$form.find('#name,#email,#message').val('').removeClass('ui-state-error')
				 	$('.validateTips').html('All form fields are required.').removeClass('ui-state-highlight');
				});	
			}	
		},
		
		// Sends an email 
		sendEmail:function($form){
			var name=$form.find('#name'),
				email=$form.find('#email'),
				message=$form.find('#message'),
				allFields=$([]).add(name).add(email).add(message),
				tips = $('.validateTips');
				
				// Email form helpers
			var updateTips=function(t){
				tips.text(t)
					.addClass('ui-state-highlight');				
			};
		
			var checkLength=function(o,n,min,max){
				if(o.val().length>max||o.val().length<min){
					o.addClass('ui-state-error');
					updateTips('Length of '+n+' must be '+
						min+' to '+max+'.');
					return false;
				}else{
					return true;
				}
			};
		
			var checkRegexp=function(o,regexp,n){
				if(!(regexp.test(o.val()))){
					o.addClass('ui-state-error');
					updateTips(n);
					return false;
				}else{
					return true;
				}
			};
			
			var bValid=true;
			allFields.removeClass('ui-state-error');

			bValid=bValid&&checkLength(name,'username',3,50);
			bValid=bValid&&checkLength(email,'email',6,80);
			bValid=bValid&&checkLength(message,'message',10,5000);

			bValid=bValid&&checkRegexp(name,/^[a-z]([0-9 a-z])+$/i,'Name may consist of a-z, 0-9');							
			bValid=bValid&&checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, 'Email address invalid' );
			
			if(bValid){		
				tips.removeClass('ui-state-highlight').text('');
				$(global.select.loading).show();
										
				$.ajax({
					type:'POST',
					url:global.services.sendMessage,
					data:{name:name.val(),email:email.val(),message:message.val()},
					success:function(response){
						$(global.select.loading).hide();
						
						if(response=='error'){
							tips.text('Sorry, something\'s gone wrong.');
						}else{
							tips.text('Thankyou, your message has been sent.');
						}						
					},
					error:function(response){
						$(global.select.loading).hide();
						tips.text('Sorry, something\'s gone wrong.');
					}
				});					
			}			
		}			
	},
	
	// Construct
	init:function(){
		// Configure the page
		this.hlp.configurePage(this.hlp.getCurrentPageOnLoad());
		
		// Register elements
		this.page.register.button();
		this.page.register.tvPictureShake();		
		
		// Bind UI
		this.page.bind.ui();
	}
};

// Construct
/////////////////////////////////////////////////////////////////////////////////////	
$(window).ready(function(){
	global.init();	
});

