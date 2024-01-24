let sec_per_turn = 30;

let sec = 0;
let song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let score = 0;
let f_packages = 1;
let m_packages = 1;
let gr_packages = 1;
let hardcore_level = 1;
let options;
let skill = '';
let rate = '';
let lang = '';
let year = '';
let genre = '';
let artist_type = '';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let finalMessage = '';
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
let withoutAnswers = false;
let isSingle = true;
let audio;
let start_count_down = false;
let rating = [];
let songs_backup;
let overall;

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	$('#pause').show();
	let answer = '';
	if(num){
		answer = options[num-1];
	} else {
		answer = $('#answer_input').val();
	}
	start_count_down = false;
	if(audio && audio.paused){
		audio.play();
	}
	modeToggle();
	let group = songs[song_count].group;
	let song = songs[song_count].song;
	let song_year = songs[song_count].year;
	if(!song_year) {
		song_year = '';
	} else {
		song_year = ' (' + song_year + ')';
	}
	if(answer.toUpperCase() == songs[song_count].group.toUpperCase()){
		mirror_eval(rightAnswer(song_year), 20, "green");
		$("#option_" + num).addClass("green");
		correct++;
		if (!~rate.indexOf('+ ' + group)){
			$('#rate').html(rate = '<br/>+ ' + group + rate);
		}
		$('#score').html(++score);
	} else {
		mirror_eval(rightAnswer(song_year), 20, "red");
		$("#option_" + num).addClass("red");
		$('#skill').html(skill = '<br/>- ' + group + '<br/>"' + song + '"' + song_year + skill);
	}
		toggleGameButton();
		next();
}

function rightAnswer_EN(){
	return songs[song_count].song;
}

function rightAnswer_RU(year){
	return songs[song_count].group + ' "' + songs[song_count].song + '"' + year;
}

function next(){
	if(song_count==songs.length-1){
		$('#song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Верно: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=finalMessage; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		toggleLearn();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function toggle(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
		$('.game_button').prop('disabled', true);
	} else {
		$('#learn').prop('disabled', true);
		$('.game_button').prop('disabled', false);
	}
}

function toggleLearn(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
	} else {
		$('#learn').prop('disabled', true);
	}
}

function toggleGameButton(){
	if($('.game_button').is('[disabled]')){
		$('.game_button').prop('disabled', false);
	} else {
		$('.game_button').prop('disabled', true);
	}
}

let lang_letter;

function learn(){
	if(withoutAnswers){
		$('.without_answers').show();
	} else {
		$('.answer').show();
	}
	$('#pause').hide();
	$('#back').hide();
	$('#package_content').hide();
	$('#answer_input').val('');
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	$('#mirror').hide();
}

async function sec_15(){
	if(audio.paused){
		audio.play();
		count_down(15);
	} else {
		audio.currentTime += 15;
		if(time_left < 15){
			time_left = 15;
		}
	}
}

function song_pause() {
	if(audio.paused){
		audio.play();
	} else {
		audio.pause();
	}
}

let time_left = 0;
async function count_down(end){
	start_count_down = true;
	time_left = end;
	while(start_count_down && time_left-- > 0){
		await sleep(1000);
		if(isSingle){	
			$('#sec').html(new Intl.NumberFormat().format(sec+=1));
		} else if(isP1Turn) {
			$('#p1_sec').html(new Intl.NumberFormat().format(p1_sec+=1));
		} else {
			$('#p2_sec').html(new Intl.NumberFormat().format(p2_sec+=1));
		}
	}
	if(start_count_down){
		audio.pause();
	}
}

let time_min = 0;
async function count_time(){
	while(true){
		await sleep(60000);
		$('#min').html(++time_min);
	}
}

function time_toggle() {
	$('#sec_h2').toggle();
	$('#min_h2').toggle();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decolorOptions(){
	for(let i = 1; i <= 4; i++){
		$("#option_" + i).removeClass("red");
		$("#option_" + i).removeClass("green");
	}
}

function setAudio(){
	if(audio){
		audio.pause();
	}
	if(!songs[song_count].audioPath){
		audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	} else {
		audio = new Audio(songs[song_count].audioPath + '.mp3');
	}
	audio.play();
}

function randomAnswers(){
	options = [];
	let current_answers = answers;
	current_answers = removeDuplicates(current_answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(current_answers,correctAnswer);
	if(current_answers.length > 4){
		removeItemOnce(answers,correctAnswer);
	} else {
		current_answers = removeItemOnce(removeDuplicates(songs.map(item=>item.group)),correctAnswer);
	}
	shuffle(current_answers);
	options.push(current_answers[0]);
	options.push(current_answers[1]);
	options.push(current_answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function skipGroup(flag, group){
	group = group.replace("#", "'");
	if(!flag.checked){
		songs = jQuery.grep(songs, function(value) {
		  return value.group != group;
		});
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	} else {
		$('.group_item').prop('checked', true);
		songs = songs_backup;
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	}
}

function emptyOptions(){
	$('#option_1').html('');
	$('#option_2').html('');
	$('#option_3').html('');
	$('#option_4').html('');
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeDuplicates(arr) {
	var uniqueValues = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
	return uniqueValues;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play_pause() {
   var mediaVideo = $("#song").get(0);
   if (mediaVideo.paused) {
       mediaVideo.play();
   } else {
       mediaVideo.pause();
  }
}

function toggleArtist(){
	if(toggleFlag){
		$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	$('#answer_input').keypress(function (e) {
	  if (e.which == 13) {
		choose();
		return false;
	  }
	});	
	setup();
}

// EN songs
const en_1990_gr_icon = [
	'rock_medium',
	'rock_hard',
	'rock_very_hard',
	'pop_medium',
	'pop_hard',
	'pop_very_hard',
	'womens_vocals',
	'womens_vocals_2',
	'eurodance'
];

const EN_1990_GR_PACK_1 = 1;
const EN_1990_GR_PACK_2 = 2;
const EN_1990_GR_PACK_3 = 4;
const EN_1990_GR_PACK_4 = 5;
const EN_1990_GR_PACK_5 = 7;
const EN_1990_GR_PACK_6 = 9;
const EN_1990_GR_PACK_7 = 6;
const EN_1990_GR_PACK_8 = 3;
const EN_1990_GR_PACK_9 = 8;

let en_1990_gr = [
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Basket Case",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "When I Come Around",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Green Day',
			song : "Minority",
			year : 2000
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "Why Don't You Get A Job",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "The Kids Aren't Alright",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Offspring',
			song : "Self Esteem",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : "Guns N Roses",
			song : "Don't Cry",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : "Guns N Roses",
			song : "November Rain",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : "Guns N Roses",
			song : "Knockin' On Heaven's Door",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'ACDC',
			song : "Moneytalks",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'ACDC',
			song : "Big Gun",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'ACDC',
			song : "Hard as a Rock",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Give It Away",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Under The Bridge",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Red Hot Chili Peppers',
			song : "Otherside",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Eat The Rich",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Cryin'",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Aerosmith',
			song : "Crazy",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'REM',
			song : "Loosing My Religion",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'REM',
			song : "Shiny Happy People",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Oasis',
			song : "Wonderwall",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Oasis',
			song : "Champagne Supernova",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Oasis',
			song : "Live Forever",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "Blaze Of Glory",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "Always",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Bon Jovi',
			song : "Bed Of Roses",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "One",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Garbage',
			song : "I Think I'm Paranoid",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Garbage',
			song : "#1 Crush",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Garbage',
			song : "Stupid Girl",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "The Fly",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'U2',
			song : "Discotheque",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Blink 182',
			song : "Dammit",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Blink 182',
			song : "What's My Age Again?",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_1,
			group : 'Blink 182',
			song : "All The Small Things",
			year : 2000
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'REM',
			song : "Man On The Moon",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Queen',
			song : "Made In Heaven",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Chumbawamba',
			song : "Tubthumping",
			year : 1997
		},	
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Soundgarden',
			song : "Black Hole Sun",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Goo Goo Dolls',
			song : "Iris",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Goo Goo Dolls',
			song : "Slide",
			year : 1998
		},	
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Soundgarden',
			song : "Spoonman",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Urge Overkill',
			song : "Girl, You'll Be A Woman Soon",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'ZZ Top',
			song : "My Head's In Mississippi",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'ZZ Top',
			song : "Give It Up",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'ZZ Top',
			song : "Pincushion",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Massive Attack',
			song : "Unfinished Sympathy",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Massive Attack',
			song : "Teardrop",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Cypress Hill',
			song : "Insane In The Brain",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Cypress Hill',
			song : "Hits from the Bong",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Cypress Hill',
			song : "Tequila Sunrise",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Suicide Blonde",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Shining Star",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'INXS',
			song : "Taste It",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Foo Fighters',
			song : "Monkey Wrench (1997)",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Foo Fighters',
			song : "Everlong (1997)",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Jamiroquai',
			song : "Virtual Insanity",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Moloko',
			song : "Sing in Back",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Beloved',
			song : 'Sweet harmony',
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Fugees',
			song : "Killing Me Softly",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Kriss Kross',
			song : "Jump",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Reamonn',
			song : "Supergirl",
			year : 2000
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Extreme',
			song : "More Than Words",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Fools Garden',
			song : "Lemon Tree",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Duran Duran',
			song : "Ordinary World",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Duran Duran',
			song : "Come Undone",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Texas',
			song : "Summer Son",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'UB40',
			song : "I Can't Help Falling In Love With You",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'No Mercy',
			song : "Where Do You Go",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Wet Wet Wet',
			song : "Love Is All Around",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Tears For Fears',
			song : "Break It Down Again",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Fugees',
			song : "Ready Or Not",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Fools Garden',
			song : "Probably",
			year : 1997
		},	
		{
			pack : EN_1990_GR_PACK_4,
			group : 'TLC',
			song : "No Scrubs",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Ten Sharp',
			song : "You",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Soul Asylum',
			song : "Runaway Train",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Boyz II Men',
			song : "I'll Make Love To You",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Boyz II Men',
			song : "End Of The Road",
			year : 1992
		},	
		{
			pack : EN_1990_GR_PACK_4,
			group : 'TLC',
			song : "Waterfalls",
			year : 1995
		},		
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Mike + The Mechanics',
			song : "Over My Shoulder",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Mike + The Mechanics',
			song : "Another Cup of Coffee",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Hanson',
			song : "MMMBop",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'White Town',
			song : "Your Woman",
			year : 1997
		},	
		{
			pack : EN_1990_GR_PACK_4,
			group : '4 Non Blondes',
			song : "What's Up?",
			year : 1992
		},		
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Touch & Go',
			song : "Would You...?",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Touch & Go',
			song : "Tango In Harlem",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Pretenders',
			song : "I'll Stand by You",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Sixpence None The Richer',
			song : "Kiss Me",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Everything But The Girl',
			song : "Missing",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Genesis',
			song : "I Can't Dance",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Genesis',
			song : "No Son Of Mine",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Lightning Seeds',
			song : "You Showed Me",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Vaya Con Dios',
			song : "Nah Neh Nah",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Lighthouse Family',
			song : "Ain't No Sunshine",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Depeche Mode',
			song : "Enjoy The Silence",
			year : 1990,
			ignore : true
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Depeche Mode',
			song : "Policy Of Truth",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Depeche Mode',
			song : "World In My Eyes",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "Girls And Boys",
			year : 1994,
			ignore : true
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "Country House",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "Song 2",
			year : 1997,
			ignore : true
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Spice Girls',
			song : "Too Much",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Spice Girls',
			song : "Say You'll Be There",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Spice Girls',
			song : "Move Over",
			year : 1997,
			ignore : true
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Verve',
			song : "Bitter Sweet Symphony",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cardigans',
			song : "Do You Believe",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cardigans',
			song : "Erase / Rewind",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Cardigans',
			song : "Lovefool",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "NSYNC",
			song : "Bye Bye Bye",
			year : 2000
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "NSYNC",
			song : "It's Gonna Be Me",
			year : 2000
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'No Doubt',
			song : "Just A Girl",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'No Doubt',
			song : "Don't Speak",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Back for Good",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Relight My Fire",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Take That',
			song : "Babe",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "When the Lights Go Out",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "Got the Feelin'",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Five',
			song : "Everybody Get Up",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Verve',
			song : "Lucky Man",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Verve',
			song : "Sonnet",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Paradisio',
			song : "Bailando",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Paradisio',
			song : "Vamos a la Discoteca",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Reel 2 Real',
			song : "Can You Feel It (feat. The Mad Stuntman)",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Reel 2 Real',
			song : "Go On Move (ft The Mad Stuntman)",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Reel 2 Real',
			song : "I Like to Move It (ft The Mad Stuntman)",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Eiffel 65',
			song : "Blue (Da Ba Dee)",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Eiffel 65',
			song : "Move Your Body",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Crazy Town',
			song : "Butterfly",
			year : 2000
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'SNAP',
			song : "The Power",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'SNAP',
			song : "Believe In It",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'SNAP',
			song : "Rhythm Is A Dancer",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Capella',
			song : "U Got 2 Let The Music",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Urban Cookie Collective',
			song : "High On A Happy Vibe",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'CoRo',
			song : "Because the Night (ft Taleesa)",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'New Order',
			song : "World In Motion",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Culture Beat',
			song : "Mr Vain",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Culture Beat',
			song : "Anything",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Antique',
			song : "Opa Opa",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Corona',
			song : "The Rhythm of the Night",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Masterboy',
			song : "Feel the Heat of the Night",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'EMF',
			song : "Unbelievable",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Pharao',
			song : "There Is A Star",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Pharao',
			song : "I Show You Secrets",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Pharao',
			song : "Gold In The Pyramid",
			year : 1995
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Inner Circle',
			song : "Sweat (A La La La La Song)",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Smash Mouth',
			song : "All Star",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Smash Mouth',
			song : "I'm A Believer",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Yaki-Da',
			song : "I Saw You Dancing",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Yaki-Da',
			song : "Just a Dream",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Sade',
			song : "No Ordinary Love",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Domino',
			song : "Baila baila conmigo",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Real McCoy',
			song : "Another Night",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'New Order',
			song : "Regret",
			year : 1993
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Eiffel 65',
			song : "Too Much Of Heaven",
			year : 2000
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Together and Forever",
			year : 1999
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Only You",
			year : 2000
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Captain Jack',
			song : "Little Boy",
			year : 1999
		},		
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Sash',
			song : "Equador",
			year : 1996
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Sash',
			song : "Adelante",
			year : 1999
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Me & My',
			song : "Dub I Dub",
			year : 1995
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Me & My',
			song : "Baby Boy",
			year : 1995
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Me & My',
			song : "Secret Garden",
			year : 1997
		},	
		{
			pack : EN_1990_GR_PACK_2,
			group : 'Foo Fighters',
			song : "My Hero",
			year : 1998
		},	
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Cue',
			song : "Hello",
			year : 2000
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Basic Element',
			song : "Touch",
			year : 1995
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Basic Element',
			song : "Move Me",
			year : 1996
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Basic Element',
			song : "The Promise Man",
			year : 1994
		},			
		{
			pack : EN_1990_GR_PACK_6,
			group : '2 Unlimited',
			song : "Get Ready For This",
			year : 1991
		},	
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Corona',
			song : "Baby Baby",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Corona',
			song : "Try Me Out",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : '2 Unlimited',
			song : "Twilight Zone",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : '2 Unlimited',
			song : "Tribal Dance",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Portishead',
			song : "Sour Times",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Portishead',
			song : "Glory Box",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'L7',
			song : "Drama",
			year : 1992
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'L7',
			song : "Off the Wagon",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Guano Apes',
			song : "Open Your Eyes",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Guano Apes',
			song : "Lords Of The Boards",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Brooklyn Bounce',
			song : "Bass, Beats & Melody",
			year : 2000
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Brooklyn Bounce',
			song : "Get Ready to Bounce",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'NSYNC',
			song : "Tearing up my heart",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : "Chained to You",
			year : 2000
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : "All Around Me",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Savage Garden',
			song : "Violet",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Pulp',
			song : "Common People",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Pulp',
			song : "Disco 2000",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Pulp',
			song : "Mis-Shapes",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'UB40',
			song : "Kingston Town",
			year : 1990
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'East 17',
			song : "Stay Another Day",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'East 17',
			song : "Hey Child",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Backstreet Boys',
			song : "We've Got It Goin' On",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Backstreet Boys',
			song : "I'll never break your heart",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Backstreet Boys',
			song : "Larger than life",
			year : 1998
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Pearl Jam',
			song : "Alive",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Pearl Jam',
			song : "Jeremy (1992)"
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Alice In Chains',
			song : "Would? (1992)"
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Alice In Chains',
			song : "Man in the Box (1990)"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "Bomfunk MCs",
			song : "Rocking, Just To Make Ya Move (1999)"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "Bomfunk MCs",
			song : "Uprocking Beats"
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : "Bomfunk MCs",
			song : "B-Boys & Flygirls"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Digital Underground",
			song : "The Humpty Dance"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Digital Underground",
			song : "Kiss You Back"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Black Box",
			song : "Everybody Everybody"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Black Box",
			song : "Strike It Up"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "New Radicals",
			song : "You Get What You Give"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "New Radicals",
			song : "Someday We’ll Know"
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : "Semisonic",
			song : "Singing in My Sleep"
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : "Semisonic",
			song : "Secret Smile"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Faithless",
			song : "Insomnia"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Faithless",
			song : "Salva Mea"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : "Faithless",
			song : "God Is a DJ"
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Salt-N-Pepa',
			song : "Let's Talk About Sex"
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Salt-N-Pepa',
			song : "Shoop"
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Salt-N-Pepa',
			song : "Whatta Man"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Wu-Tang Clan',
			song : "C.R.E.A.M. (Cash Rules Everything Around Me)"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Wu-Tang Clan',
			song : "Protect Ya Neck"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Wu-Tang Clan',
			song : "Aint Nuthing ta F' Wit"
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Nightcrawlers',
			song : "Push the Feeling On"
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Nightcrawlers',
			song : "Surrender Your Love"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Naughty by Nature',
			song : "O.O.P"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Naughty by Nature',
			song : "Hip Hop Hooray"
		},
		{
			pack : EN_1990_GR_PACK_9,
			group : 'Deee-Lite',
			song : "Groove Is in the Heart"
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Stone Sour',
			song : "Through Glass"
		},
		{
			pack : EN_1990_GR_PACK_8,
			group : 'Stone Sour',
			song : "Bother"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Daze',
			song : "Together forever"
		},
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Duran Duran',
			song : "Wild boys"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Army of Lovers',
			song : "Crucify"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Army of Lovers',
			song : "Sexual Revolution"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Army of Lovers',
			song : "Obsession"
		},
		{
			pack : EN_1990_GR_PACK_7,
			group : 'East 17',
			song : "It's Alright"
		},
		{
			pack : EN_1990_GR_PACK_5,
			group : 'Spice Girls',
			song : "Two Become One"
		},	
		{
			pack : EN_1990_GR_PACK_4,
			group : 'Kind of Blue',
			song : "Bitter Blue"
		},	
		{
			pack : EN_1990_GR_PACK_7,
			group : 'Chemical Brothers',
			song : "Hey Boy Hey Girl",
			year : 1999
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Right Said Fred',
			song : "I'm Too Sexy",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Maxx',
			song : "Get A Way",
			year : 1993
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Maxx',
			song : "No More (I Can't Stand It)",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'Maxx',
			song : "You Can Get It",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'U96',
			song : "Das Boot",
			year : 1991
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'U96',
			song : "Love Religion",
			year : 1994
		},
		{
			pack : EN_1990_GR_PACK_6,
			group : 'U96',
			song : "Heaven",
			year : 1996
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "The Universal",
			year : 1995
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Blur',
			song : "Beetlebum",
			year : 1997
		},
		{
			pack : EN_1990_GR_PACK_3,
			group : 'Depeche Mode',
			song : "It's No Good",
			year : 1997
		}
];

let en_1990_gr_1 =	en_1990_gr.filter(item => item.pack == 1);
let en_1990_gr_2 =	en_1990_gr.filter(item => item.pack == 2);
let en_1990_gr_3 =	en_1990_gr.filter(item => item.pack == 3);
let en_1990_gr_4 =	en_1990_gr.filter(item => item.pack == 4);
let en_1990_gr_5 =	en_1990_gr.filter(item => item.pack == 5);
let en_1990_gr_6 =	en_1990_gr.filter(item => item.pack == 6);
let en_1990_gr_7 =	en_1990_gr.filter(item => item.pack == 7);
let en_1990_gr_8 =	en_1990_gr.filter(item => item.pack == 8);
let en_1990_gr_9 =	en_1990_gr.filter(item => item.pack == 9);


let music = [
	{
		arr: en_1990_gr,
		lang: 'en',
		year: '1990',
		type: 'gr',
		packs: [
				{
					arr: en_1990_gr_1,
					name: 'EN 1990s Groups: Rock Medium'
				},
				{
					arr: en_1990_gr_2,
					name: 'EN 1990s Groups: Rock Hard'
				},
				{
					arr: en_1990_gr_3,
					name: 'EN 1990s Groups: Rock Very Hard'
				},
				{
					arr: en_1990_gr_4,
					name: 'EN 1990s Groups: Pop Medium'
				},
				{
					arr: en_1990_gr_5,
					name: 'EN 1990s Groups: Pop Hard'
				},
				{
					arr: en_1990_gr_6,
					name: "EN 1990s Groups: Pop Very Hard"
				},
				{
					arr: en_1990_gr_7,
					name: "EN 1990s Groups: Women's Vocals"
				},
				{
					arr: en_1990_gr_8,
					name: "EN 1990s Groups: Women's Vocals 2"
				},
				{
					arr: en_1990_gr_9,
					name: 'EN 1990s Groups: Eurodance'
				}
			]
	},
]

let songs_to_map;
let mapping_result;
function map_songs(){
	$('.package').hide();
	$('#mirror').hide();
	$('#map').hide();
	$('#mapping').show();
	for(var j=0; j < music.length; j++){
		music[j].arr = generateSongIdsWithPrefix(music[j].arr, music[j].lang, 
												music[j].year, music[j].type);
	}
	showMapping(0, "en_2000_gr", "gr");
}

function select_mapping_button(suffix, type){
	$('.gr').attr('src', 'img/chart/gr.png');
	$('.m').attr('src', 'img/chart/m.png');
	$('.f').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + type + '_selected.png';
	$('#btn_' + suffix).attr('src', selected);
}

function showMapping(index, suffix, type){
	select_mapping_button(suffix, type);
	mapping_result = '';
	let h1_start = `<h1>`;
	let h1_end = `</h1>`;
	let br = `<br/>`;
	let hr = `<hr/>`;
	for(var j=0; j < music[index].packs.length; j++){
		mapping_result += h1_start + music[index].packs[j].name + h1_end;
		mapping_result += map_songs_format(music[index].packs[j].arr);
		mapping_result += br + hr;
	}
	$('#mapping_content').html(mapping_result);
}

function generateSongIdsWithPrefix(arr, lang, year, type){
	let prefix = lang + '_' + year + '_' + type + '_';
	let audioPath = 'audio/' + lang + '/' + year + '/' + type + '/';
	let imgPath = 'img/' + lang + '/' + year + '/' + type + '/';
	let id;
	for(var i=1; i <= arr.length; i++){
		id = 'Song (' + i + ')';
		arr[i-1].id = prefix + id;
		arr[i-1].audioPath = audioPath + id;
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generateSongIdsByPaths(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function generateSongIdsImgGroup(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generatePathsBySongName(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].audioPath = audioPath + arr[i-1].group;
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function map_songs_format(arr){
	arr = arr.filter(song => !song.ignore);
	let h2_start = `<h2 style='margin-bottom: -20px;'>`;
	let h2_end = `</h2>`;
	let h3_start = `<h3 style='font-family: serif; margin-left: 30px;' >`;
	let h3_end = `</h3>`;
	let div_start = `<div>`;
	let div_end = `</div>`;
	let br = `<br/>`;
	//let img_start = `<img width="300" height="300" src="`;
	let img_end = `.jpg" />`;
	let img_play_start = `<img class='pointer onhover' width="30" height="30" src="img/navi/play.png" onclick="playSong('`;
	let img_play_middle = `')" id='`;
	let img_play_end = `'" />`;
	let space = '&nbsp;';
	songs_to_map = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let curr_group = songs_to_map[0].group;
	//let result = img_start + songs_to_map[0].imgPath + img_end + br
	let result = h2_start + curr_group + ':' + h2_end + h3_start;
	let id;
	for(let i = 0; i < songs_to_map.length; i++){
		id = songs_to_map[i].id.replace(' ', '_').replace('(', '').replace(')', '');
		if(curr_group != songs_to_map[i].group){
			curr_group = songs_to_map[i].group;
			result += h3_end + h2_start + songs_to_map[i].group + ':' + h2_end 
			+ h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id
			+ img_play_middle + id + img_play_end + div_end;
		} else {
			result += div_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id 
			+ img_play_middle + id + img_play_end
			+ div_end;
		}
	}
	result += h3_end;
	return result;
}

let last_song_id;
let is_playing = false;
function playSong(audioPath, id){
	if(id == last_song_id){
		if(is_playing){
			audio.pause();
			$('#' + id).attr('src', 'img/navi/play.png');
			is_playing = false;
		} else {
			audio.play();
			$('#' + id).attr('src', 'img/navi/pause.png');
			is_playing = true;
		}
	} else {
		if(audio){
			audio.pause();
		}
		$('#' + last_song_id).attr('src', 'img/navi/play.png');
		last_song_id = id;
		is_playing = true;
		$('#' + id).attr('src', 'img/navi/pause.png');
		audio = new Audio(audioPath + '.mp3');
		audio.play();
	}
}

function getGroupNamesSorted(){
	let group_names = removeDuplicates(songs.map(item=>item.group)).sort();
	return group_names;
}

function showGroupNames(){
	songs_backup = songs;
	let group_names = getGroupNamesSorted();
	
	let tag_1 = `<h3><label class='checkbox-google'><input class='group_item' checked id='group_`;
	let tag_2 = `' type='checkbox' onchange='skipGroup(this,"`;
	let tag_3 = `");'><span class='checkbox-google-switch'></span></label> `;
	let tag_4 =	`</h3>`;
	let result = '';
	for(let i = 0; i < group_names.length; i++){
		result += tag_1 + i + tag_2 + group_names[i].replace("'", "#") + tag_3 + group_names[i] + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
	toggleLearn();
}

function hide_navi_icons(){
	$('#map').hide();
	$('#mirror').hide();
	$('.settings').hide();
	
	$('#sec_15').show();
	$('#back').show();
}

let gr_package_names = [];
let package_names;

function show_packages(num){
	for(var i=1; i <= num; i++){
		if(package_names[i-1]){
			$('#package_' + i).attr("src", 'img/package/' + package_names[i-1] + ".png");
		} else {
			$('#package_' + i).attr("src", 'img/package/' + i + ".png");
		}
		$('#package_' + i).show();
	}
}

function package_num(num){
	hide_navi_icons();
	$('#current_pack').show();
	$('#current_pack').attr('src', $('#package_' + num).attr('src'));
	back = back_to_packages;
	$('.package').hide();
	setPathsByPack(num);
	showGroupNames();
}

function setPaths(artist_type, package_num, genre){
		let songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '/' + year + '/';
			imgPath = 'img/' + lang + '/' + year + '/';
		if(genre){
			songs_str += '_' + genre;
			audioPath += genre + '/';
			imgPath += genre + '/';
		}
		if(artist_type){
			songs_str += '_' + artist_type;
			audioPath += artist_type + '/';
			imgPath += artist_type + '/';
		}
		if(package_num){
			songs_str += '_' + package_num;
			audioPath += package_num + '/';
			imgPath += package_num + '/';
		}
		songs = generateSongIds(eval(songs_str));
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}

function setPathsByPack(num){
	let arr = generateSongIds(eval(lang + '_' + year + '_' + artist_type));
	songs = arr.filter(song => song.pack == num && !song.ignore);
	songs.forEach(song => {
		song.audioPath = 'audio/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/' + song.group;
	});
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	shuffle(songs);
}
	
function setMusicalAlphabet(){
	let result = [];
	let arr = generateSongIds(eval(lang + '_' + year + '_gr'));
	let arr_pack;
	audioPath = 'audio/' + lang + '/' + year + '/gr/';
	imgPath = 'img/' + lang + '/' + year + '/gr/';
	for(let i = 1; i <= gr_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Группа', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_m'));
	audioPath = 'audio/' + lang + '/' + year + '/m/';
	imgPath = 'img/' + lang + '/' + year + '/m/';
	for(let i = 1; i <= m_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнитель', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_f'));
	audioPath = 'audio/' + lang + '/' + year + '/f/';
	imgPath = 'img/' + lang + '/' + year + '/f/';
	for(let i = 1; i <= f_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнительница', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	result = result.flat();
	shuffle(result);
	songs = result.slice(0, 20);
	answers = songs.map(item=>item.group);
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	showGroupNames();
}
	
function setMusicalAlphabetPack(arr, type, audioPath, imgPath){
	shuffle(arr);
	arr = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let group = arr[0].group;
	let result = [];
	result.push(arr[0]);
	for(let i = 1; i < arr.length; i++){
		if(group == arr[i].group){
			continue;
		} else {
			group = arr[i].group;
			result.push(arr[i]);
		}
	}
	result.forEach(song => {
		song.letter = Array.from(song.group)[0];
		song.type = type;
		song.audioPath = audioPath + song.id;
		song.imgPath = imgPath + song.group;
	});
	return result;
}

function generateSongIds(arr){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
	}
	return arr;
}

function back_to_packages(){
	$('#back').hide();
	$('#current_pack').hide();
	$('#package_content').hide();
	toggleLearn();
	setup();
}

let back;
let expressMode = false;
let generateSongs;
let generateArr;
let generateAudioPath;
let generateImgPath;

function setup(){
	lang = 'en';
	year = '1990';
	artist_type = 'gr';
	back = back_to_packages;
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	count_time();
	package_names = en_1990_gr_icon;
	show_packages(package_names.length);
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}