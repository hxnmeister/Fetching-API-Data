const apiUrl = "https://jsonplaceholder.typicode.com/users";
const loadByJsButton = document.getElementById("loadbyjs");
const loadByFetchButton = document.getElementById("loadbyfetch");
const loadByJsContainer = document.getElementById("loadbyjscontainer");
const loadByFetchContainer = document.getElementById("loadbyfetchcontainer");


loadByJsButton.addEventListener("click", async () =>
{
    const request = new XMLHttpRequest();
     
    request.open("GET", apiUrl, false);
    request.send();

    if(request.status === 200)
    {
        const response = JSON.parse(request.responseText);

        loadByJsContainer.innerHTML = "";
        response.map( x => loadByJsContainer.innerHTML += `<p>${x.name}</p>`);
    }
    else
    {
        alert(request.status + ": " + request.statusText);
    }
});

loadByFetchButton.addEventListener("click", async () => 
{
    const request = await fetch(apiUrl).then(result => result.json());

    loadByFetchContainer.innerHTML = "";
    request.map(x => loadByFetchContainer.innerHTML += 
        `
            <div id="${x.id}" class="personblock">
                <p>${x.name}</p>
                <div>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
                <form>
                    <ipnut type="text">
                    <ipnut type="submit" value="Save">
                </form>
            </div>
        `);
})