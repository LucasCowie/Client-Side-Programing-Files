(function(tests){

  var DATA_URL = "https://prog2700.onrender.com/dna/";
  var DNA_SEQUENCE = "GTGCCAATGTTACTGCTAAATCTCTATATACAGTGGCTTAAGGATGGGGGGCCCAGCAGCGGCCGACCCCCCCCCTCAGTGTGGAATCAACCGGAATTGAGG";
  
  // Extract Codons as JavaScript Array from the DNA Sequence String.
  var extractCodonsFromDNA = function(dnaSequence)
  {
    var codons = dnaSequence.match(/.{1,3}/g);
    // TODO: ADD CODE TO COMPLETE THE FUNCTION HERE...
    // you'll get an error notification in the console until the function is completed correctly

    return codons;
  }
  
  // Compare the Codons array with the map of Amino Acids found in the json data.
  // Add any matches to the aminos array.
  var translateCodonsToAminos = function(codons, jsonData) 
  {
    var aminos = [];
    var jsonLenght = Object.keys(jsonData).length;
    codons.forEach(codon => {
      for(i=0;i<jsonLenght;i++){
        jsonData[i].codons.forEach(amino =>{
          if(codon == amino){
            aminos.push(jsonData[i].abbr);
          }
        })
      }
    });
    // TODO: ADD CODE TO COMPLETE THE FUNCTION HERE...
    // you'll get an error notification in the console until the function is completed correctly
    
    return aminos;
  }
  
  var runProgram = async function () { //made this function async so the api has time to load
    var codons = extractCodonsFromDNA(DNA_SEQUENCE); //DO NOT MODIFY
    var aminos; //DO NOT MODIFY
    

    // TODO: ENTER CODE TO LOAD DATA FROM API HERE.
  async function loadAPI(url){
    try{
        const response = await fetch(url);
        responseCheck(response); //response error handing
        const data = await response.json();

        return data; //return data
    }catch(error){
        console.log(error);
    }
  } 
  function responseCheck(res){
    if(!res.ok){
        throw new Error("Response Error: "+response.status);
    }
  }
  let json = await loadAPI(DATA_URL);
    //ONCE YOU HAVE YOUR API CALL WORKING, UNCOMMENT THE LINE ABOVE THE runTests line AND APPLY 
    //BOTH LINES (including the test line) WITHIN THE CODE ABOVE WHERE YOU RECEIVE YOUR JSON DATA FROM YOUR API CALL...
    //DO NOT MODIFY THE LINES EXCEPT FOR UNCOMMENTING THEM AND MOVING THEM TO THE CORRECT LOCATION ABOVE IN CODE

    aminos = translateCodonsToAminos(codons, json); //DO NOT MODIFY...but you can uncomment and move when ready
    tests.runTests(codons, aminos) //DO NOT MODIFY...but you can move when ready
  }

  runProgram(); // DO NOT MODIFY

})(tests);