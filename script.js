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
    let request = await fetch(apiUrl).then(result => result.json());
    
    loadByFetchContainer.innerHTML = "";
    request.map(x => loadByFetchContainer.innerHTML += 
        `
            <div id="${x.id}" class="personblock">
                <p>${x.name}</p>
                <div>
                    <button class="editbutton">Edit</button>
                    <button class="deletebutton">Delete</button>
                </div>
                <form name="saveform" hidden>
                    <input name="editedname" type="text">
                    <input type="submit" value="Save" class="savebutton">
                </form>
            </div>
        `);

    loadByFetchContainer.querySelectorAll(".editbutton").forEach(button => 
    {
        button.addEventListener("click", (event) => 
        {
            form = event.currentTarget.parentNode.parentNode.querySelector(`[name="saveform"]`);
            form.hidden = !form.hidden;
        });
    });
    loadByFetchContainer.querySelectorAll(".deletebutton").forEach(button => 
    {
        button.addEventListener("click", async (event) => 
        {
            const currentElement = event.currentTarget.parentNode.parentNode;
            currentElement.innerHTML += `<h2>Loading...</h2>`;
            await fetch(`${apiUrl}/${currentElement.id}`, { method: "DELETE"}).then(x => 
                {
                    if(x.status === 200)
                    {
                        currentElement.remove();
                        alert(`User with id: ${currentElement.id} was deleted!`);
                    }
                    else
                    {
                        alert("Something went wrong with error: " + x.status);
                    }
                });
        })
    });
    loadByFetchContainer.querySelectorAll(`[name="saveform"]`).forEach(saveform => 
    {
        saveform.addEventListener("submit", async (event) => 
        {
            event.preventDefault();
            event.currentTarget.hidden = true;

            const newContent = event.currentTarget.editedname.value;
            const currentElement = event.currentTarget.parentNode;
            currentElement.innerHTML += `<h2>Loading...</h2>`;
            await fetch(`${apiUrl}/${currentElement.id}`, 
            {
                method: "PUT",
                body: JSON.stringify
                (
                    {
                        name: newContent
                    },
                ),
                headers: 
                {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }).then(x => 
                {
                    if(x.status == 200)
                    {
                        currentElement.querySelector("h2").remove();
                        x.json().then(item => currentElement.querySelector("p").innerHTML = item.name);
                    }
                    else
                    {
                        alert(x.statusText + ": " + x.status);
                    }
                })

            
        })
    })
})