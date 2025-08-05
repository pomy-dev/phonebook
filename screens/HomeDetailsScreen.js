import { Button, StyleSheet, Text, View } from 'react-native'

export default function HomeDetailsScreen({ navigation }) {
    return (
        <View style={styles.screenContainer}>
            <Text>Home Details Screen</Text>
            <Button
                title="Go back to Home"
                onPress={() => navigation.goBack()}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

