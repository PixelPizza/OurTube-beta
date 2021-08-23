module.exports = {
	name: "error",
	execute(client, error){
		console.error('The websocket connection encountered an error:', error);
	}
}