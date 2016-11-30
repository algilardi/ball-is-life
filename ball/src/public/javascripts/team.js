document.addEventListener('DOMContentLoaded', main);

function main() {
    var teamButton = document.getElementById('teamBtn');

    teamButton.addEventListener('click', function(event) {
        event.preventDefault();

        var req = new XMLHttpRequest();
        var team = encodeURI(document.getElementById('team').value);
        var url = 'http://localhost:3000/api/sort?team=' + team + '';
        console.log(url);
        req.open('GET', url, true);

        req.addEventListener('load', function(){
            if (req.status >= 200 && req.status < 400) {
                var clips = JSON.parse(req.responseText);
                var newClips = document.createElement('div');
                var oldClips = document.getElementById('clip-div');
                var div = document.getElementById('main-div');
                newClips.id = 'clip-div';
                newClips.classList.add('clips');
                clips.reverse();
                if (clips.length == 0) {
                    var noClipsFound = document.createElement('h3');
                    noClipsFound.textContent = "No Clips have been added yet for this team!";
                    newClips.appendChild(noClipsFound);
                }
                clips.forEach(function(clip) {

                    var title = document.createElement('a');
                    title.textContent = clip.title;
                    title.classList.add('clip-title');
                    title.href = "/clip/" + clip.videoID;

                    var iframe = document.createElement('iframe');
                    iframe.width = "640";
                    iframe.height = "480";
                    iframe.frameBorder = "0";
                    iframe.src = clip.url;

                    var postedBy = document.createTextNode("Posted by: ");

                    var postedByUser = document.createElement('a');
                    postedByUser.textContent = clip.user;
                    postedByUser.href = '/user/' + clip.user;

                    var commentText = document.createElement('span');
                    commentText.innerHTML += ' &#127936; &nbsp' + clip.comments.length + '&nbsp';

                    var commentLink = document.createElement('a');
                    commentLink.textContent = 'comments';
                    commentLink.href = '/clip/' + clip.videoID;

                    newClips.appendChild(title);
                    newClips.appendChild(document.createElement('br'));
                    newClips.appendChild(iframe);
                    newClips.appendChild(document.createElement('br'));
                    newClips.appendChild(postedBy);
                    newClips.appendChild(postedByUser);
                    newClips.appendChild(commentText);
                    newClips.appendChild(commentLink);
                    newClips.appendChild(document.createElement('br'));
                    newClips.appendChild(document.createElement('br'));
                });
                div.replaceChild(newClips, oldClips);
            }
        })

        req.send();
    })
}
