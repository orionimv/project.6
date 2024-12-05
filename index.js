
$(document).ready(function(){
    // data
    var country;
    var countryCode;
    var city;
    var cityName;
    var temp; //kalvin
    var windspeed; // ms
    var windspeedkmH;
    var windspeedms;
    var windspeedknots;
    var description;
    var weatherID
    var humidity;
    var cTemp;
    var fTemp;
    var api;
    var tempToggle = true;
    $i=0;

    // capitalize function
    function letter(str) {
        return str.toLowerCase().split(' ').map(function(word) {
            return word.replace(word[0], word[0].toUpperCase()
            )}).join(' ');
    }

    // set city in placeholder function
    function setCity(city, country) {
        city = letter(city);
        $('#city').val(city+','+country);
    };

    // location function
    // https://cors-anywhere.herokuapp.com/http://ip-api.com/json
    function getlocation(){
        $.getJSON('https://freegeoip.net/json/', function(location){
            //country= location.countryCode.toLowerCase(); ,'+country+'
            city= location.city;
            api ='https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=a36e7a326a579bb5d2549c43adf7376d';
            weather(api);
        }); // end of getJSON
    };// end of get location

    // enter the city from keyboard by city name
    $('#city').keypress(function(e){

        var key = e.which;
        if( key == 13 ){
            //As ASCII Code for enter key is 13
            $('#city').submit();
            city = $(this).val();
            console.log(city)
            // if zip-code
            var zipcode = $(this).val();
            var placeholder = $('#city').attr('placeholder');
            //console.log(placeholder);
            if (placeholder === "enter your city" ) {
                api =' https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=a36e7a326a579bb5d2549c43adf7376d';
            }
            else if (placeholder === "enter zip-code" ) {
                api =' https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?zip='+zipcode+'&appid=a36e7a326a579bb5d2549c43adf7376d'
            }
            console.log('api: '+api)
            weather(api)
        }; // end of if
    }); //end of eneter the city

    // show local weather function
    function weather(api) {
        $.getJSON(api, function(weather){
            // data
            cityName = weather.name;
            temp = weather.main.temp;
            windspeed = weather.wind.speed;
            description = weather.weather[0].description;
            // zmiana
            weatherID =weather.weather[0].id;
            humidity = weather.main.humidity;
            country = weather.sys.country;

            // tempreture
            fTemp =((temp)*(9/5)-459.67).toFixed(0);
            cTemp =(temp -  273.15).toFixed(0);

            // windspeed
            windspeedkmH = Math.round(windspeed*3,6).toFixed(0);
            windspeedms = windspeed.toFixed(0);
            windspeedknots = Math.round(((1.9438*windspeed)*100)/100).toFixed(0);

            // set city and country in placeholder
            setCity(cityName, country);

            //set units in html
            $('#weather-description').html(description).fadeIn();
            $('#temp').html(cTemp);
            $('h1 .sign').html('&deg;C')
            $('#windspeed').html(windspeedkmH);
            $('.wind-speed .sign').html(' km/h');
            $('#humidity').html(humidity);

            // windspeed toggel
            $('.wind-speed').click(function() {
                if ($i === 0) {
                    $('#windspeed').html(windspeedms);
                    $('.wind-speed .sign').html('  m/s');
                    $i = 1;
                }
                else if  ($i === 1) {
                    $('#windspeed').html(windspeedknots);
                    $('.wind-speed .sign').html(' knots');
                    $i = 2;
                }
                else {
                    $('#windspeed').html(windspeedkmH);
                    $('.wind-speed .sign').html(' km/h');
                    $i = 0;
                }
            }); // end of windspeed toggle

            // temperature toggel
            $(".temperature").click(function() {
                console.log('klik');
                if(tempToggle===false) {
                    $("#temp").html(cTemp);
                    $("h1 .sign").html("&deg;C");
                    tempToggle=true;
                }
                else {
                    $("#temp").html(fTemp);
                    $("h1 .sign").html("&deg;F");
                    tempToggle=false;
                }
            }); // end of temp toggle  

            // changin weather icon acording to actual data
            changeWeatherIcon(weatherID);
        });
    }; // end of weather function

    // on click pleaceholder shows
    $('#location').on('click', getlocation);

    getlocation();

    $('#city').click(function(){
        $('#city').val("");
    });

    // chagne weather icons acording to weather data
    function changeWeatherIcon(weatherID) {
        // weather codes from APIlocalweather   in arrays
        var thunderstorm = [200,201,202,210,211,212,221,230,231,232];
        var snow = [600,601,602,615,611,612,616,620,621,622];
        var sun = [800];
        var rain = [300,301,302,310,311,312,313,314,321,500,501,502,503,504,511,520,521,522,531];
        var clouds = [801,802,803,804];
        x = clouds.indexOf(weatherID);

        // debug coment
        // weatherID=300;

        // adds display block css to icons
        var removeVisible = $('.icon').removeClass('visible');

        // wind icon versions
        var newSrc ="https://github.com/r00bal/Demo/blob/master/wind_direction_indicator_f9f9f7.png?raw=true";
        var oldSrc ="https://github.com/r00bal/Demo/blob/master/wind_direction_indicator.png?raw=true";

        // set colors functions
        function setColorsblue() {
            $('.container').css({'background-color':'#1ad3fd'});
            $('.sexy_line').css({'background':'-webkit-gradient(linear, 0 0, 100% 0, from(#1ad3fd), to(#1ad3fd),color-stop(50%, #06333E)'})
            $('body, html').css({'color':'#06333E',
                'background-color':'#e2e2e2'});
            $('h1,h3, #weather-description, #run').css({'color':'#06333E'});
            $('.sign').css({'color':'#FD3380'});
            $('img').attr('src',oldSrc );
        };
        function setColorsgreen() {
            $('.container').css({'background-color':'#00FFB6 '});
            $('.sexy_line').css({'background':'-webkit-gradient(linear, 0 0, 100% 0, from(#00FFB6), to(#00FFB6),color-stop(50%, #00402D)'})
            $('body, html').css({'color':'#FF4E40',
                'background-color':'#0DC0FF'});
            $('h1, #weather-description, #run, h3').css({'color':'#00402D'});
            $('.sign').css({'color':'#FF4E40'});
            $('img').attr('src',oldSrc );
        };
        function setColorsGrey() {
            $('.container').css({'background-color':'#363738'});
            $('.sexy_line').css({'background':'-webkit-gradient(linear, 0 0, 100% 0, from(#363738), to(#363738),color-stop(50%, #f9f9f7)'})
            $('body, html').css({'color':'#2E3845',
                'background-color':'#FFFFFF'});
            $('h1, h3, #weather-description, #run').css({'color':'#f9f9f7'});
            $('.sign').css({'color':'#1ad3fd'});
            $('img').attr('src',newSrc );
        }
        function setColorsWhite() {
            $('.container').css({'background-color':'#1D65F0'});
            $('.sexy_line').css({'background':'-webkit-gradient(linear, 0 0, 100% 0, from(#1D65F0), to(#1D65F0),color-stop(50%, #01FDF3)'})
            $('body, html').css({'color':'#1FDF3',
                'background-color':'#b1b4b8'});
            $('h1, #weather-description, #run, h3').css({'color':'#fff'});
            $('.sign').css({'color':'#1FDF3'});

            $('img').attr('src',newSrc );
        };

        // check if weatherID is in weather code arrays
        // if yes, changes color palets according to the actual weather
        if (thunderstorm.indexOf(weatherID) !== -1) {
            removeVisible;
            $('#storm').addClass('visible');
            setColorsGrey();
        };

        if (snow.indexOf(weatherID) !== -1) {
            removeVisible;
            $('#snow').addClass('visible');
            setColorsWhite();
            snowing();
        };

        if (sun.indexOf(weatherID) !== -1) {
            removeVisible;
            $('#sunny').addClass('visible');
            setColorsblue();
        };

        if (rain.indexOf(weatherID) !== -1) {
            //setColorsgreen();
            setColorsGrey();
            removeVisible;
            $('#rain').addClass('visible');
        };
        if (clouds.indexOf(weatherID) !== -1) {
            removeVisible;
            $('#clouds').addClass('visible').fadeIn();;
            setColorsblue();
        };
        if (weatherID >= 900) {
            removeVisible;
            setColorsGrey();
            $('#run').addClass('visible run').html("<h1>RUN!</h1><h2>f@#kin run ! for your life</h2>");
        }
        if ((weatherID >= 700) && (weatherID  <799)) {
            removeVisible;
            setColorsgreen();
            $('#justClouds').addClass('visible');
        }
    }; // end of set icon

    // snowing function
    function snowing() {
        //function timers
        var timer1 = 0;
        var timer2 = 0;
        var numer1 = 0;
        var numer2 = 1;
        // rondom number between numbers max, min
        function randomIntFromInterval(max,min)
        { return Math.floor(Math.random()*(max-min+1)+min);}
        // numb and numb2 - even and odd flakes - creates divs of flakes
        // n - number of animation 1 -3


        function numb() {
            numer1 = numer1 + 2 ; if (numer1>=160) numer1 = 0;
            timer1 = setTimeout(numb,500);
            var n= (Math.floor(Math.random()*3))+1;
            var position = randomIntFromInterval(0,10); // set random left position css of flakes
            var position2 = randomIntFromInterval(75,85);// set random top position css of flakes
            var timeFall = randomIntFromInterval(7,10); // se random time of animation of flakes

            // put postions and times of animation to life
            $(".snow div:nth-child("+numer1+")").css({
                "animation": "snow"+n+" "+timeFall+"s linear",
                "left": +position+"0%",
                "top":  +position2+"%"
            });
        }; // end of function

        // same as before = function numb
        function numb2() {
            numer2 = numer2+ 2 ; if (numer2>=160) numer2=1;
            timer2 = setTimeout(numb2,500);
            var nEven= (Math.floor(Math.random()*3))+1;
            var positionEven = randomIntFromInterval(0,10);
            var position2Even = randomIntFromInterval(75,85);
            var timeFallEven = randomIntFromInterval(7,10);
            $(".snow div:nth-child("+numer2+")").css({
                "animation": "snow"+nEven+" "+timeFallEven+"s linear",
                "left": +positionEven+"0%",
                "top":  +position2Even+"%"
            });
        };
        numb();
        numb2();

        // creates divs for flakes
        function makeFlakes()  {
            var i = 0;
            var snow= "";
            var flake = '<div class="spin"></div>';
            while (i<=160) {
                snow += flake;
                i++;
            }
            $(".snow").html(snow);
        }  // end of make flakes

        makeFlakes();
    };//THE END  of snow

//Settings 
// show menu
    $('#settings').on('click',function(){
        $('.settings').fadeToggle('visible');
    });

// set units in menu
    $('form').click(function(){
        var windUnit = $('input[name="wind"]:checked').val();
        var tempUnit = $('input[name="temp"]:checked').val();
        var cityUnit = $('input[name="city"]:checked').val();

//console.log(windUnit);
//console.log(tempUnit);
//console.log(cityUnit);

// temp menu
        switch (tempUnit) {
            case "c" :
                $("#temp").html(cTemp);
                $("h1 .sign").html("&deg;C");
                break;
            case "f" :
                $("#temp").html(fTemp);
                $("h1 .sign").html("&deg;F");
                break;
        }
// wind menu
        switch (windUnit) {
            case "ms" :
                $('#windspeed').html(windspeedms);
                $('.wind-speed .sign').html('  m/s');
                break;
            case "knots" :
                $('#windspeed').html(windspeedknots);
                $('.wind-speed .sign').html(' knots');
                break;
            case "kmh" :
                $('#windspeed').html(windspeedkmH);
                $('.wind-speed .sign').html(' km/h');
                break;
        }

        switch (cityUnit) {
            case "name" :
                $('#city').attr("placeholder", "enter your city");
                break;
            case "zip" :
                $('#city').attr("placeholder", "enter zip-code");
                break;
        }
    }); // end of set units
    getlocation();
});
//}); //THE END


Resources