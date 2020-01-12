import React from 'react';
import { ITodoModel } from '../todo-model';
import { List, Colors, Portal, Dialog, TextInput, Switch, Paragraph, HelperText, Button } from 'react-native-paper';
import { deleteTodo, putTodo } from '../todo-service';
import { View, StyleSheet } from 'react-native';

interface IProps {
    item: ITodoModel;
    removeTodoFromList: (id: string) => void;
    updateList: (value: ITodoModel) => void;
}

const TodoView: React.FC<IProps> = ({ item, removeTodoFromList, updateList }) => {
    const [visible, setVisible] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [todoForUpdate, setTodoForUpdate] = React.useState<ITodoModel>({} as ITodoModel);
    const [updateLoading, setUpdateLoading] = React.useState(false);

    React.useEffect(() => {
        setTodoForUpdate(item);
    }, []);

    const deleteTodoFromDialog = async () => {
        setDeleteLoading(true);

        try {
            await deleteTodo(item.id); // from DB
            removeTodoFromList(item.id); // from UI
        } catch (e) {
            setError(e.message);
        }

        setDeleteLoading(false);
    }

    const handleTitleChange = (input: string) => {
        let todo: ITodoModel = { ...todoForUpdate };
        todo.title = input;
        setTodoForUpdate(todo);
    }

    const handleDescriptionChange = (input: string) => {
        let todo: ITodoModel = { ...todoForUpdate };
        todo.description = input;
        setTodoForUpdate(todo);
    }

    const handleFinishedChange = (input: boolean) => {
        setTodoForUpdate({ ...todoForUpdate, finished: input });
    }

    const updateTodoFromDialog = async () => {
        if (!todoForUpdate.title || !todoForUpdate.description) {
            setError('Title and description are required.');
        }
        setUpdateLoading(true);
        try {
            await putTodo(todoForUpdate);
            updateList(todoForUpdate);
            setVisible(false);
        } catch (e) {
            setError(e.message);
        }
        setUpdateLoading(false);
    }

    return (
        <>
            <List.Item onPress={() => setVisible(true)}
                title={item.title}
                description={item.description}
                right={otherProps => {
                    if (item.finished) {
                        return (
                            <List.Icon {...otherProps}
                                color={Colors.green300}
                                icon="check-circle" />
                        );
                    }
                }
                }
            />
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>Edit your todo</Dialog.Title>
                    <Dialog.Content>
                        <View style={{ marginBottom: 20 }}>
                            <View style={styles.divider} />
                            <TextInput
                                value={todoForUpdate.title}
                                onChangeText={handleTitleChange} />
                            <View style={styles.divider} />
                            <TextInput
                                value={todoForUpdate.description}
                                onChangeText={handleDescriptionChange}
                                multiline
                                numberOfLines={4} />
                        </View>
                        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                            <Switch value={todoForUpdate.finished} onValueChange={handleFinishedChange} />
                            <Paragraph style={{ paddingLeft: 16, alignSelf: 'center' }}>
                                Finished
                            </Paragraph>
                        </View>
                        <HelperText type="error">{error}</HelperText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button loading={deleteLoading}
                            onPress={() => deleteTodoFromDialog()}>
                            Delete
                        </Button>
                        <View style={{ flex: 1 }} />
                        <Button onPress={() => setVisible(false)}>
                            Cancel
                            </Button>
                        <Button loading={updateLoading}
                            onPress={() => updateTodoFromDialog()}>
                            Update</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    )
}
export default TodoView;

const styles = StyleSheet.create({
    divider: {
        height: 16,
    },
});
