import { render, screen, fireEvent } from '@testing-library/react-native';
import { SinglePost, Post } from "../components/post.js";

import {
    NativeModules,
  } from 'react-native';
import renderer from "react-test-renderer";

const createTestProps = (props) => ({
    post: Post("title", "post_id", "seller_id", "username", 
                "price", "isbn", "description", "img", "type"), 
    userid: "userid",
    postList: [],
    ...props
});

describe('TestSinglePost', () => {
    beforeEach(() => {
        NativeModules.TestModule = { test: jest.fn() };
        jest.mock('react-native-paper', () => 'Card');
        jest.mock('react-native-paper', () => 'Title');
        jest.mock('react-native-paper', () => 'Button');
        jest.mock('react-native-paper', () => 'Paragraph');
        jest.mock('@react-navigation/native', () => 'useNavigation');
    });

    it('renders correctly', () => {
        const props = createTestProps();
        const post = renderer.create(<SinglePost {...props}/>);
        expect(post).toMatchSnapshot();
    })

});