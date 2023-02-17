import { Asset } from 'expo-asset'
import React from 'react'
import { ActivityIndicator, Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import * as ImageManipulator from 'expo-image-manipulator';
import BackgroundImage from './components/BackgroundImage';
import Story from './components/Story';

const getSize = (uri: string) => new Promise(
    (resolve, reject) => Image.getSize(uri, (width, height) => { console.log(width); return resolve({ width, height }) }, reject)
)

const screens = [
    require('./assets/story1.png'),
    require('./assets/story2.png'),
    require('./assets/story3.png'),
    require('./assets/story4.png'),
]

interface IAppProps { }

interface IAppState {
    stories: { top: string; bottom: string; }[];
    index: number;
}

export default class App extends React.Component<IAppProps, IAppState> {
    state: IAppState = {
        stories: [],
        index: 1
    }

    async componentDidMount() {
        // const edits = screens.map(async (screen) => {
        //     const image = Asset.fromModule(screen);
        //     console.log(image)
        //     await image.downloadAsync();
        //     const { localUri } = image;
        //     console.log(localUri)
        //     const { width, height } = await getSize(localUri);
        //     console.log(width, height)
        //     const crop1 = {
        //         crop: {
        //             originX: 0,
        //             originY: 0,
        //             width,
        //             height: height / 2,
        //         },
        //     };
        //     const crop2 = {
        //         crop: {
        //             originX: 0,
        //             originY: height / 2,
        //             width,
        //             height: height / 2,
        //         },
        //     };
        //     const { uri: top } = await ImageManipulator.manipulateAsync(localUri, [crop1]);
        //     const { uri: bottom } = await ImageManipulator.manipulateAsync(localUri, [crop2]);
        //     return { top, bottom };
        // });
        // const stories = await Promise.all(edits);
        const stories = [{
            top: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            bottom: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source."
        },
        {
            top: "Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32",
            bottom: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham"
        },
        {
            top: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
            bottom: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        },
        {
            top: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
            bottom: "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable."
        }]
        this.setState({ stories });
    }

    onSnap = (id: number) => {
        const { index: currentIndex } = this.state
        this.setState({ index: currentIndex + id })
    }

    render() {
        const { onSnap } = this
        const { stories, index } = this.state
        console.log(stories)
        if (stories.length === 0) {
            return (
                <ActivityIndicator size="large" color="blue" />
            )
        }
        const prev = stories[index - 1]
        const current = stories[index]
        const next = stories[index + 1]

        if (!prev) {
            return (
                <View style={styles.container}>
                    <StatusBar hidden />
                    <BackgroundImage
                        top={current.top}
                        bottom={next.bottom}
                    />
                    <View style={{ flex: 1 }} />
                    <Story
                        key={`${index}-bottom`}
                        front={current.bottom}
                        back={next.top}
                        bottom
                        {...{ onSnap }}
                    />
                </View>
            )
        }
        if (!next) {
            return (
                <View style={styles.container}>
                    <StatusBar hidden />
                    <BackgroundImage
                        top={prev.top}
                        bottom={current.bottom}
                    />
                    <Story
                        key={`${index}-top`}
                        front={current.top}
                        back={prev.bottom}
                        {...{ onSnap }}
                    />
                    <View style={{ flex: 1 }} />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <BackgroundImage
                    top={prev.top}
                    bottom={next.bottom}
                />
                <Story
                    key={`${index}-top`}
                    front={current.top}
                    back={prev.bottom}
                    {...{ onSnap }}
                />
                {/* <View style={{ flex: 1 }} >
                </View> */}
                <Story
                    key={`${index}-bottom`}
                    front={current.bottom}
                    back={next.top}
                    bottom
                    {...{ onSnap }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
