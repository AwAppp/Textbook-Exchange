import { render, screen, fireEvent } from '@testing-library/react-native';
import { Chat } from "../components/Chat";
import {
    NativeModules,
  } from 'react-native';
import renderer from "react-test-renderer";

const createTestProps = (props) => ({
    route: {
        userId: "userId", 
        name: "name", 
        image: "imageUrl"
    },
    navigation: { 
        navigate: jest.fn() 
    },
    ...props
});


describe('TestProject', () => {
    beforeEach(() => {
      NativeModules.TestModule = { test: jest.fn() };
      jest.mock('react-native-gifted-chat', () => 'gifted_chat');
      jest.mock('LogBox', ()=> "logbox");
      jest.mock('react-native-elements', () => 'Avatar');
    });
    
    it('should render correctly', () => {
        const props = createTestProps();
        const chat = renderer.create(<Chat {...props}/>);
        expect(chat).toMatchSnapshot();
    })
  });

