# nummunchers
Number Munchers game 
www.nummunchers.com

## Description 
A classic game that I played when I was a kid in the 90's. This is an open source project with the goal of reinventing the game with a few new rules. My hope is to get the younger generation to be excited about math and have fun at the same time. 

**Technology Stack**


**Status** : Beta 0.0.5 

## Installation

To install, fork and then clone to your local machine.
```
git clone https://github.com/toopham/numbermunchers.git
```
install all dependencies within folder
```
cd numbermunchers
npm install
```

**Database** :
User accounts, sessions and scores are stored in a local SQLite file. No setup is needed: the file is created automatically at server/data/numdb.sqlite the first time the server starts. To use a different location, set the DB_PATH environment variable.

bundle react app with webpack by using the command
```
npm run build
```


Start server with game running on localhost:3000
```
npm start
```
**Docker** :
A prebuilt image is published to GitHub Container Registry. The SQLite database is stored in /data, so mount a volume there to keep accounts and scores.
```
docker run -d -p 3000:3000 -v numbermunchers-data:/data ghcr.io/shinseiryu/numbermunchers:sqlite
```
Or build it yourself with `docker build -t numbermunchers .`

----
#Num Munchers



## Getting involved
I welcome all feedback/contributions from other developers. If you are interested in this project you can reach out to me through Github, Linkedin, or email me at toopham at gmail dot com.


## Open source licensing info
[MIT License](https://github.com/toopham/numbermunchers/blob/main/LICENSE)
