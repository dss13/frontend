var app = angular.module('chat', ['ngSanitize'])
app.run(function($rootScope, $http) {
    $http.get('/data/online.json').then(function(results) {
        $rootScope.online = results.data.online
    })
})
app.controller('messsagesController', function($scope, $rootScope, $http) {
    setTimeout(function() {
        var messageBody = document.querySelector('#uk-messages-box')
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight
    }, 0)
})

app.controller('composeController', function($scope, $rootScope, $http) {
    $scope.message = ""
    $http.get('/data/emoji.json').then(function(results) {
        var messages =  results.data.data
        for (var i = 0; i < messages.length; i++) {
            messages[i].emoji = emojione.shortnameToImage(messages[i].name)
        }
        $scope.emojis = messages
    })

    $scope.addEmoji = function(emoji) {
        console.log(emoji)
        $scope.message += emoji
    }

    $scope.sendMessage = function() {
        var data = {
            "message": emojione.shortnameToImage($scope.message),
            "me": true
        }
        $rootScope.messages.push(data)
        setTimeout(function() {
            var messageBody = document.querySelector('#uk-messages-box')
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight
            $scope.message = ""
            $scope.$apply()
            document.getElementById("emoji-button").click()
        }, 0)
    }
})

app.controller('onlineController', function($scope, $rootScope, $http) {
    $scope.userChat = function() {
        var userObj = this.m
        var active = document.getElementsByClassName("active")[0]
        if (active) {
            document.getElementsByClassName("active")[0].className = document.getElementsByClassName("active")[0].className.replace(" active", "")
        }
        document.getElementById(userObj.id).className+=" active"
        var userName = document.getElementById("userName")
        if (userName.innerHTML.trim() != userObj.name) {
            userName.innerHTML = userObj.name
            $rootScope.messages = [
                {
                    "message": "We're loading",
                    "me": false
                },
                {
                    "message": "Please hold on...",
                    "me": false
                },
                {
                    "message": "It's almost there",
                    "me": false
                }
            ]
            $http.get('/data/' + userObj.id + '.json').then(function(results) {
                var messages = results.data.messages
                for (var i = 0; i < messages.length; i++) {
                    messages[i].message = emojione.shortnameToImage(messages[i].message)
                }
                $rootScope.messages = messages

                setTimeout(function() {
                    var messageBody = document.querySelector('#uk-messages-box')
                    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight
                }, 0)
            })
        }
    }
})