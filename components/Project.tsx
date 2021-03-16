import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Labels from './Labels';

const OriginalContent = styled.div<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? 0.1 : 1)};
`;

const Background = styled.div<{ active: boolean }>`
  position: fixed;
  width: 100vw;
  min-height: 100vh;
  left: 0;
  top: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: background-color 0.5s;
  background-color: ${({ active }) =>
    active ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
`;

const Position = styled.div<{ x: number; y: number; center: boolean }>`
  transition: all 0.5s cubic-bezier(0.47, 0.23, 0.34, 1.29);
  /* transition: all 0.5s ease-in-out; */
  position: absolute;
  top: ${({ center, y }) => (center ? 0 : `${y}px`)};
  left: ${({ center, x }) => (center ? 0 : `${x}px`)};
  @media (min-width: 767px) {
    top: ${({ center, y }) => (center ? '50%' : `${y}px`)};
    left: ${({ center, x }) => (center ? '50%' : `${x}px`)};
    transform: ${({ center }) =>
      center && 'translateX(-50%) translateY(-40vh)'};
  }
`;

type transStates = 'entering' | 'entered' | 'exiting' | 'exited';

const Project: React.FC<Partial<ProjectDetails>> = (props) => {
  const [transState, setTransState] = useState<transStates>('exited');
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const content = useRef<HTMLDivElement>();

  const TIMEOUT = 500;

  const calulatePosition = () => {
    const { x, y } = content.current.getBoundingClientRect();
    setPos({ x, y: y });
  };

  const activate = () => {
    calulatePosition();
    setTransState('entering');
    setTimeout(() => {
      setTransState('entered');
    }, TIMEOUT / 2);
  };

  const deactivate = () => {
    calulatePosition();
    setTransState('exiting');
    setTimeout(() => {
      setTransState('exited');
    }, TIMEOUT);
  };

  const active = ['entered', 'exiting'].includes(transState);

  return (
    <div>
      <OriginalContent ref={content} visible={active} onClick={activate}>
        <Modal active={false} {...props} />
      </OriginalContent>
      {transState !== 'exited' && (
        <Background active={transState === 'entered'} onClick={deactivate}>
          <Position x={pos.x} y={pos.y} center={transState === 'entered'}>
            <Modal
              active={transState === 'entered'}
              close={deactivate}
              {...props}
            />
          </Position>
        </Background>
      )}
    </div>
  );
};

export default Project;

interface ProjectDetails {
  title: string;
  description: string;
  author: string;
  labels: string[];
  url: string;
  file: string;
}

const ModalBody = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  border: 1px solid black;
  border-radius: ${({ active }) => (active ? '25px' : '5px')};
  background-color: white;
  transition: all 0.5s;
  margin-bottom: ${({ active }) => active && '80px'};
  width: ${({ active }) => (active ? '50vw' : '28vw')};
  @media (max-width: 767px) {
    width: 100vw;
    min-height: ${({ active }) => (active ? '100vh' : 0)};
    border-radius: ${({ active }) => active && 0};
    top: ${({ active }) => active && 0};
    margin: ${({ active }) => active && 0};
  }
  & > .hide-on-active {
    height: ${({ active }) => (active ? 0 : '2em')};
    overflow: hidden;
    transition: height 0.5s;
  }
  & .toolbar {
    height: ${({ active }) => (active ? '3em' : 0)};
    transition: height 0.5s;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    overflow: hidden;
    & > * {
      margin: 0 10px;
      transition: opacity 0.1s;
      &:hover {
        cursor: pointer;
        opacity: 0.3;
      }
    }
  }
  & > .row {
    display: flex;
    flex-direction: row;
    max-height: ${({ active }) => (active ? '500px' : 0)};
    overflow: hidden;
    transition: max-height 0.3s;
    & > div {
      border-top: 1px solid lightgray;
      width: 100%;
      &:not(.label) {
        text-align: left;
        border-left: 1px solid lightgray;
        padding-left: 5px;
      }
    }
  }
  & .thumbnail {
    transition: all 0.5s;
    aspect-ratio: 16 / 9;
    width: 100%;
    height: auto;
    max-width: 100vw;
  }
  & .label {
    font-weight: bold;
  }
`;

interface Modal extends Partial<ProjectDetails> {
  active: boolean;
  close?: VoidFunction;
}

const Modal: React.FC<Modal> = ({
  active,
  title,
  description,
  author,
  labels,
  url,
  file,
  close,
}) => (
  <ModalBody active={active} onClick={(e) => active && e.stopPropagation()}>
    <div className={'toolbar'}>
      <FontAwesomeIcon icon={faTimes} size={'2x'} onClick={close} />
      <FontAwesomeIcon icon={faEdit} size={'2x'} />
    </div>
    <img className={'thumbnail'} src={'/placeholder.jpg'} />
    <div className={'hide-on-active'}>
      <Labels activeLabels={labels} />
    </div>
    <div className={'hide-on-active'}>{title}</div>
    <div className={'row'}>
      <div className={'label'}>Titel</div>
      <div className={'title'}>{title}</div>
    </div>
    <div className={'row'}>
      <div className={'label'}>Beschrijving</div>
      <div className={'description'}>{description}</div>
    </div>
    <div className={'row'}>
      <div className={'label'}>Gemaakt door</div>
      <div className={'author'}>{author}</div>
    </div>
    <div className={'row'}>
      <div className={'label'}>Labels</div>
      <div className={'labels'}>
        <Labels activeLabels={labels} />
      </div>
    </div>
    <div className={'row'}>
      <div className={'label'}>URL</div>
      <div className={'url'}>
        <a href={url}>{url}</a>
      </div>
    </div>
    {file && (
      <div className={'row'}>
        <div className={'label'}>Download</div>
        <div className={'files'}>{file}</div>
      </div>
    )}
  </ModalBody>
);
