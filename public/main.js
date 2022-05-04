const coin = document.getElementById("coin")

coin.addEventListener("click", coinFlip)

async function coinFlip() {

    const finish = "app/flip/"
    
	const url = document.baseURI+finish
    	await fetch(url)
  		    .then(function(response) {
    		    return response.json();
  		     	})
			    
			.then(function(flipOutput) {
				console.log(flipOutput);
				document.getElementById("result").innerHTML = flipOutput.flip;
				document.getElementById("quarter").setAttribute("src", "assets/img/"+flipOutput.flip+".png");
				});
  };

const coins = document.getElementById("coins")

coins.addEventListener("submit", flipCoins)

async function flipCoins(event) {
	
	event.preventDefault();
	
	const finish1 = "app/flip/coins/"
		const url = document.baseURI+finish1
	
		const formEvent = event.currentTarget
	
		try {
			const formData = new FormData(formEvent);
			const output = await flipRequest({ url, formData });
			
			console.log(output);
			
			document.getElementById("coinlist").innerHTML = coinsHTML(output.raw);
			document.getElementById("heads").innerHTML = "Heads: "+output.summary.heads;
			document.getElementById("tails").innerHTML = "Tails: "+output.summary.tails;
	
		} catch (error) {
			console.log(error);
	}
}

async function flipRequest({ url, formData }) {
	const plainFormData = Object.fromEntries(formData.entries());
	const formDataJson = JSON.stringify(plainFormData);
	console.log(formDataJson);
	const options = {
		method: "POST",
		headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
		},
		body: formDataJson
	};
	const response = await fetch(url, options);
	return response.json()
}

const call = document.getElementById("call")
call.addEventListener("submit", flipCall)

async function flipCall(event) {
	event.preventDefault();
	const finish3 = "app/flip/call/"
	const url = document.baseURI+finish3
	const formEvent = event.currentTarget
	try {
		const formData = new FormData(formEvent); 
		const results = await flipRequest({ url, formData });
		console.log(results);
		document.getElementById("choice").innerHTML = "Guess: "+results.call;
		document.getElementById("actual").innerHTML = "Actual: "+results.flip;
		document.getElementById("results").innerHTML = "Result: "+results.result;
   		document.getElementById("coingame").innerHTML = '<li><img src="assets/img/'+results.call+'.png" class="bigcoin" id="callcoin"></li><li><img src="assets/img/'+results.flip+'.png" class="bigcoin"></li><li><img src="assets/img/'+results.result+'.png" class="bigcoin"></li>';
	} catch (error) {
		console.log(error);
	}
}

function coinsHTML(array) {
    let text = "";
    let coinsArray = array.length
    for (let i = 0; i < coinsArray; i++) {
        text += '<li><img src="assets/img/'+coinsArray[i]+'.png" class="bigcoin"></li>';
    }
    return text
}

function navigateHome() {
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "active";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
}

function navigateOneFlip() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "active";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
}

function navigateMultipleFlips() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "active";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
}

function randomFlips() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "active";
    document.getElementById("guesscoin").className = "active";
} 