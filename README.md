# Lamentable Survivor

Lamentable Survivor is a multiplayer survival game made with [Phaser](http://phaser.io/).


## Development

Want to contribute? Great!

### Todos

 - Add menu support
 - Add more actions
 - Add illumination
 - Add more maps


## Firebase

We use Firebase as a realtime database for storing and sync data.

### Firebase security rules
```
{
    "rules": {
        ".read": false,
        ".write": false,
        "actions":{
        ".read": true,
           "counter":{
              ".write": "newData.isNumber() && ((!data.exists() && newData.val() === 1) || newData.val() === data.val()+1)"
           },
           "actions":{
            "$action_id":{
              "$user_id":{
                ".write": "!data.exists() && newData.exists() && $user_id === auth.uid"
              }
            }
           }
        }
    }
}
```