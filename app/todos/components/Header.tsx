import React from 'react';
import { ITodoModel } from '../todo-model';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Portal, Dialog, Paragraph, TextInput, HelperText } from 'react-native-paper';
import { postTodo } from '../todo-service';

interface IProps {
    text?: string;
    updateList: (event: ITodoModel) => void;
}

const Header: React.FC<IProps> = ({ text, updateList }) => {
    const [visible, setVisible] = React.useState(false);
    const [todo, setTodo] = React.useState<ITodoModel>({
        description: '',
        finished: false,
        id: '',
        title: ''
    } as ITodoModel);
    const [createLoading, setCreateLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleTitleChange = (input: string) => {
        const newTodo = { ...todo };
        newTodo.title = input;
        setTodo(newTodo);
    };

    const handleDescriptionChange = (input: string) => {
        const newTodo = { ...todo };
        newTodo.description = input;
        setTodo(newTodo);
    };

    const handleCreateTodoFromDialog = async () => {
        if (!todo.title || !todo.description) {
            setError('Title and description are required.');
            return;
        }
        setCreateLoading(true);
        try {
            const { data } = await postTodo(todo);
            updateList(data);
            setTodo({ title: '', description: '' } as ITodoModel);
            setVisible(false);
        } catch (err) {
            setError(err.message);
        }
        setCreateLoading(false);
    };

    return (
        <View style={styles.header}>
            <Text style={styles.text}>{text || "Your todo's"}</Text>
            <View style={styles.buttonFrame}>
                <Button
                    onPress={() => setVisible(true)}
                    style={{ marginLeft: 16 }}
                    mode="outlined">
                    Add a todo
                </Button>
            </View>

            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>Create a new todo</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Adding a new todo so you can use it later.</Paragraph>
                        <View style={styles.divider} />
                        <TextInput
                            mode={'outlined'}
                            label="title"
                            value={todo.title}
                            onChangeText={handleTitleChange}
                        />
                        <View style={styles.divider} />
                        <TextInput
                            mode={'outlined'}
                            label="description"
                            multiline={true}
                            numberOfLines={4}
                            value={todo.description}
                            onChangeText={handleDescriptionChange}
                        />
                        <HelperText type="error">{error}</HelperText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Exit</Button>
                        <Button
                            loading={createLoading}
                            onPress={() => handleCreateTodoFromDialog()}>
                            Add
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    text: {
        fontSize: 35,
        lineHeight: 35,
        fontWeight: '700',
        padding: 32,
        paddingLeft: 16,
    },
    header: {
        flexDirection: 'row',
        alignContent: 'center',
    },
    divider: {
        height: 16,
    },
    buttonFrame: {
        justifyContent: 'center',
    },
});
