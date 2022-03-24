// function >>> return JSON data if response is OK
let getAllData = async function () {
    const url = "https://jsonplaceholder.typicode.com/";
    try {
        // fetch all apis
        const response = await Promise.all([
            fetch(`${url}users`),
            fetch(`${url}posts`),
            fetch(`${url}comments`)
        ])

        // check all apis is ok to return data
        let allStatus = await Promise.all(response.map(res => res.status));
        if (allStatus.every(st => st == 200)) {
            const data = await Promise.all(response.map(res => res.json()))
            return data;
        } else {
            //if failed to laod data show 404 error image
            return [{
                url: '/glitch-error-404-page-background_23-2148072533.jpg'
            }]
        }

    } catch (error) {
        console.log(error.message);
        return [{
            url: '/glitch-error-404-page-background_23-2148072533.jpg'
        }]
    }
}

//get data form api and render it to table
async function renderData() {
    const table = document.querySelector(".data");
    const table1 = document.querySelector(".task1");
    let data = await getAllData();
    if (data.length > 1) {
        console.log(data);
        const users = data[0];
        genericTable(users[0], "th", table1);
        users.map(
            (user) => {
                genericTable(user, "td", table1);
                createElement(
                    "tr",
                    { class: "row" },
                    '',
                    (tr) => {
                        tr.innerHTML = `
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.company.name}</td>
                            <td>Lat : ${user.address.geo.lat}</td> <td>  Lng : ${user.address.geo.lng}</td>
                            ${handlePosts(data[1], data[2], user.id)}
                        `;
                        table.appendChild(tr);
                    }
                )
            })
    } else {
        createElement('img', { src: data[0].url, style: 'margin:auto;display:block' }, '', (img) => {
            document.body.appendChild(img);
            table.style.display = "none"
        })
    }

}

//function that take comments and posts data and return every posts with specific user id 
const handlePosts = function (posts, comments, id) {
    let postOfUser = posts.filter((post) => id == post.userId);
    let title = '';
    let commentsNo = '';
    postOfUser.map(
        (post) => {
            let commentsOfPost = comments.filter((comment) => comment.postId == post.id);
            console.log(commentsOfPost.length);
            title += `<li>${post.title}</li>`;
            commentsNo += `<li>${commentsOfPost.length}</li>`
        }
    )
    return `<td><ul>${title}</ul></td>
    <td style= text-align:center><ul>${commentsNo}</ul></td>`;
}

// create element with attributes
const createElement = function (tag, attributes, textContent, cb) {
    const ele = document.createElement(tag);
    const keys = Object.keys(attributes);
    for (let key of keys) {
        ele.setAttribute(key, attributes[key]);
    }
    ele.innerHTML = textContent;
    cb(ele);
}

//display table with generic data  
const genericTable = function (user, ele, table) {
    const keys = Object.keys(user);
    createElement(
        "tr",
        { class: "row" },
        '',
        (tr) => {
            for (let key of keys) {

                let element = (ele == 'th') ? key : user[key];
                if (typeof element == "object") {
                    element = checkObject(element);
                }
                createElement(
                    ele,
                    {},
                    `${element}`,
                    (el) => {
                        tr.appendChild(el)
                    }
                )
            }
            table.appendChild(tr);
        }
    )
}

// if data contains object of objects
const checkObject = function (obj) {
    const kys = Object.keys(obj);
    console.log(kys);
    let th = '';
    let td = '';
    for (let k of kys) {
        th += `<th>${k}</th>`;
        td += `<td>${typeof obj[k] == "object" ? checkObject(obj[k]) : obj[k]}</td>`
    }
    return `
            <table>
                <tr>${th}</tr>
                <tr>${td}</tr>
            </table>                    
        `
}

renderData()