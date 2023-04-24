const { db } = require('../util/admin');
exports.getAllTodos = (request, response) => {
	const todos = [];
	db
		.collection('todos')
		.where('username', '==', request.user.username)
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			data.forEach((doc) => {
				todos.push({
					todoId: doc.id,
					title: doc.data().title,
					username: doc.data().username,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(todos);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code });
		});
};

exports.getOneTodo = (request, response) => {
	db
		.doc(`/todos/${request.params.todoId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return response.status(404).json({ error: 'Todo not found' });
			}
			if (doc.data()?.username !== request.user?.username) {
				return response.status(403).json({ error: 'Unauthorized' });
			}
			const todoData = doc.data();
			todoData.todoId = doc.id;
			return response.json(todoData);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code });
		});
};


exports.postOneTodo = (request, response) => {
	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
	}

	if (request.body.title.trim() === '') {
		return response.status(400).json({ title: 'Must not be empty' });
	}

	const newTodoItem = {
		title: request.body.title,
		username: request.user.username,
		body: request.body.body,
		createdAt: new Date().toISOString(),
	};

	db.collection('todos')
		.add(newTodoItem)
		.then((doc) => {
			const responseTodoItem = newTodoItem;
			responseTodoItem.id = doc.id;
			return response.json(responseTodoItem);
		})
		.catch((error) => {
			console.error(error);
			response.status(500).json({ error: 'Something went wrong' });
		});
};

exports.deleteTodo = (request, response) => {
    const document = db.doc(`/todos/${request.params.todoId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ 
                    error: 'Todo not found' 
            })}
            if(doc.data().username !== request.user.username){
                return response.status(403).json({error:"UnAuthorized"})
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ 
                error: err.code 
            });
        });
        exports.editTodo = (request, response) => {
            const todoId = request.params.todoId;
            const userId = request.user.username;
        
            // Make sure the user is authorized to edit the todo
            db.collection('todos')
                .doc(todoId)
                .get()
                .then((doc) => {
                    if (!doc.exists) {
                        return response.status(404).json({ error: 'Todo not found' });
                    }
        
                    const todoData = doc.data();
                    if (todoData.username !== userId) {
                        return response.status(403).json({ error: 'Unauthorized' });
                    }
        
                    // Update the todo
                    return db.collection('todos').doc(todoId).update(request.body);
                })
                .then(() => {
                    response.json({ message: 'Updated successfully' });
                })
                .catch((error) => {
                    if (error.code === 5) {
                        response.status(404).json({ message: 'Not Found' });
                    } else {
                        console.error(error);
                        response.status(500).json({ error: error.code });
                    }
                });
        };
        