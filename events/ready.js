module.exports = {
	name: "ready",
	once: true,
	execute(client){
		client.user.setActivity("Playing Music", {type: "STREAMING"});
    	console.log('ready for music!');
	}
}