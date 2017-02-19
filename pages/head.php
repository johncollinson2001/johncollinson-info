<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        	<meta name="description" content="Home page to John Collinson, UK based software engineer." />
            <meta name="keywords" content="Development, Freelance, Web design, Web development, Software development, Software engineering, Computer programming, .NET, C#, VB.NET, ASP.NET, MVC, MVP, PHP, JavaScript, jQuery, HTML, CSS" />
            <meta name="author" content="John Collinson" />
            <meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" />

            <link type="text/css" rel="stylesheet" href="css" />				
            <script type="text/javascript" src="js"></script>
            <title>John Collinson - Development, design and all things inbetween</title>
        </head>
        
        <body>           
            <div id="container"> 
                <div id="header">
                    <div id="headerTitle">
                        <a href="/<?=$serverDir?>"><img src="http://johncollinson.info/img/title.png" /></a>
                    </div>
                    
                    <div id="headerTv">
                    	<div id="tvPictureContainer">
                        	<img src="http://johncollinson.info/img/<?php if($page=='aboutme'){ echo('tvfront'); } elseif($page=='projects') { echo('tvleft'); } else { echo('tvright'); } ?>.png" />
                        </div>                    	
                    	<img src="http://johncollinson.info/img/tvbg.png" class="tvBackground" />
                    </div>                                                                     
                </div>
                                
                <div id="content">
                	<div id="contentRight">
                        <ul id="contentMenu">
                            <li>
								<?php if($page=='aboutme'){ ?>
                                    <a id="1" class="selected"><h1>About Me</h1></a>
                                <?php } else { ?>
                                    <a id="1" href="/<?=$serverDir?>aboutme">About Me</a>
                                <?php } ?>
                            </li>
                            <li>
								<?php if($page=='projects'){ ?>
                                    <a id="2" class="selected"><h1>Projects</h1></a>
                                <?php } else { ?>
                                    <a id="2" href="/<?=$serverDir?>projects">Projects</a>
                                <?php } ?>
                            </li>
                            <li>
								<?php if($page=='mycv'){ ?>
                                    <a id="3" class="selected"><h1>My CV</h1></a>
                                <?php } else { ?>
                                    <a id="3" href="/<?=$serverDir?>mycv">My CV</a>
                                <?php } ?>
                            </li>
                            <li class="contactLink"><a>Get in Touch</a></li>
                        </ul>
                        
                        <div id="contactForm">
                            <form action="/<?=$serverDir?>ajax/sendmessage.php" method="post">
                                <label for="name">Name</label>
                                <input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" />
                                <label for="email">Email</label>
                                <input type="text" name="email" id="email" value="" class="text ui-widget-content ui-corner-all" />
                                <label for="message">Message</label>
                                <textarea id="message" class="text ui-widget-content ui-corner-all"></textarea>
                                <input type="submit" class="button" value="Send" />
                            </form>
                            <img src="http://johncollinson.info/img/loading_small.gif" id="loading" />
                            <p class="validateTips">
                            	All form fields are required.                                
                            </p>                            
                        </div>
                    </div>
                    
                    <div id="contentBodyContainer">                       
                    	<div id="contentBody">