let availableKeywords = [
    'HTML',
    'CSS',
    'Easy Tutorials',
    'Javascript',
    'DJango',
    'How to start Coding',
    'Where to learn Web Design',
    ];
    
    const resultsBox = document.querySelector(".result-box");
    const inputBox = document.getElementById("input-box");
    
    inputBox.onkeyup = function(){
        let result = [];
        let input = inputBox.value;
        if(input.length){
            result = availableKeywords.filter((keyword)=>{
               return keyword.toLowerCase().includes(input.toLowerCase());
            });
            console.log(result);
        }
        display(result);
    
        if(!result.length){
            resultsBox.innerHTML = '';
        }
    }
    
    function display(result){
        const content = result.map((list)=>{
            return "<li onclick=selectInput(this)>" + list + "</li>";
        });
    
        resultsBox.innerHTML = "<ul>" +content.join('') + "</ul>";
    }
    
    function selectInput(list) {
        inputBox.value = list.innerHTML;
        resultsBox.innerHTML = '';
    }
    
    