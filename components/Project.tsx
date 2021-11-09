import {
  faEdit,
  faQuestion,
  faTimes,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useApi from 'hooks/useApi';
import useSession from 'hooks/useSession';
import useToast from 'hooks/useToast';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Labels from './Labels';
import Head from 'next/head';

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
  z-index: 1;
`;

const Position = styled.div<{ x: number; y: number; center: boolean }>`
  /* transition: all 0.5s cubic-bezier(0.47, 0.23, 0.34, 1.29); */
  transition: all 0.5s ease-in-out;
  position: absolute;
  top: ${({ center, y }) => (center || !y ? 0 : `${y}px`)};
  left: ${({ center, x }) => (center || !x ? 0 : `${x}px`)};
  @media (min-width: 767px) {
    top: ${({ center, y }) => (center || !y ? '50%' : `${y}px`)};
    left: ${({ center, x }) => (center || !x ? '50%' : `${x}px`)};
    transform: ${({ center, x, y }) =>
      (center || !x || !y) && 'translateX(-50%) translateY(-40vh)'};
  }
`;

type transStates = 'entering' | 'entered' | 'exiting' | 'exited';

const Project: React.FC<Partial<ProjectDetails>> = (props) => {
  const { callback: delCallback, submit: delSubmit } = useApi(
    `projects/${props.id}/destroy`,
    'DELETE'
  );
  const [transState, setTransState] = useState<transStates>('exited');
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const { loggedIn } = useSession();
  const { push, replace } = useRouter();
  const toast = useToast();

  const content = useRef<HTMLDivElement>();

  const TIMEOUT = 500;

  const calulatePosition = () => {
    if (props.standalone) return setPos({ x: null, y: -500 });
    const { x, y } = content.current.getBoundingClientRect();
    setPos({ x, y: y });
  };

  const activate = () => {
    if (props.standalone) setTransState('entered');
    else {
      calulatePosition();
      replace(`/projects/${props.id}`);
      setTransState('entering');
      setTimeout(() => {
        setTransState('entered');
      }, TIMEOUT / 2);
    }
  };

  const deactivate = () => {
    calulatePosition();
    setTransState('exiting');
    replace('/');
    setTimeout(() => {
      setTransState('exited');
    }, TIMEOUT);
  };

  const edit = () => {
    deactivate();
    setTimeout(() => {
      push(`/projects/${props.id}/edit`);
    }, TIMEOUT);
  };

  const remove = () => {
    if (confirm('Are you sure you want to delete this project?')) delSubmit();
  };

  delCallback(async (data) => {
    const body = await data.json();
    if (body.success) {
      toast({ type: 'success', message: 'Project removed!' });
      close();
      setTimeout(() => {
        setVisible(false);
      }, TIMEOUT);
    }
  });

  const active = ['entered', 'exiting'].includes(transState);

  useEffect(() => {
    if (props.standalone) activate();
  }, []);

  return (
    visible && (
      <div>
        {!props.standalone && (
          <OriginalContent ref={content} visible={active} onClick={activate}>
            <Modal active={false} loggedIn={loggedIn} {...props} />
          </OriginalContent>
        )}
        {transState !== 'exited' && (
          <Background active={transState === 'entered'} onClick={deactivate}>
            <Head>
              <title>FC Kluis - {props.title}</title>
              <meta name="description" content={props.description} />
            </Head>
            <Position x={pos.x} y={pos.y} center={transState === 'entered'}>
              <Modal
                active={transState === 'entered'}
                close={deactivate}
                edit={edit}
                loggedIn={loggedIn}
                remove={remove}
                {...props}
              />
            </Position>
          </Background>
        )}
      </div>
    )
  );
};

export default Project;

export interface ProjectDetails {
  id: number;
  title: string;
  description: string;
  author: string;
  labels: string[];
  url: string;
  file: string;
  thumbnail: string;
  standalone?: boolean;
}

const ModalBody = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  border: 1px solid black;
  border-radius: ${({ active }) => (active ? '25px' : '5px')};
  background-color: white;
  transition: all 0.5s;
  /* margin-bottom: ${({ active }) => active && '80px'}; */
  margin-bottom: 60px;
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
    height: 100%;
    max-width: 100vw;
    overflow: hidden;
    background-color: lightgrey;
    display: flex;
    align-items: center;
    justify-content: center;
    & > img {
      /* position: relative; */
      width: 100%;
      height: 100%;
    }
  }
  & .label {
    font-weight: bold;
  }
  & a {
    color: darkblue;
    cursor: pointer;
    text-decoration: underline;
  }
`;

interface Modal extends Partial<ProjectDetails> {
  active: boolean;
  loggedIn: boolean;
  close?: VoidFunction;
  edit?: VoidFunction;
  remove?: VoidFunction;
}

const Modal: React.FC<Modal> = ({
  active,
  title,
  description,
  author,
  labels,
  url,
  file,
  thumbnail,
  loggedIn,
  close,
  edit,
  remove,
}) => (
  <ModalBody active={active} onClick={(e) => active && e.stopPropagation()}>
    <div className={'toolbar'}>
      <FontAwesomeIcon icon={faTimes} size={'2x'} onClick={close} />
      {loggedIn && <FontAwesomeIcon icon={faEdit} size={'2x'} onClick={edit} />}
      {loggedIn && (
        <FontAwesomeIcon icon={faTrashAlt} size={'2x'} onClick={remove} />
      )}
    </div>
    <div className={'thumbnail'}>
      {thumbnail ? (
        <img src={`/uploads/thumbnails/${thumbnail}.jpg`} loading={'lazy'} />
      ) : (
        <FontAwesomeIcon icon={faQuestion} size={'4x'} />
      )}
    </div>
    <div className={'hide-on-active'}>
      <Labels activeLabels={labels} />
    </div>
    <div className={'hide-on-active'}>{title}</div>
    <div className={'row'}>
      <div className={'label'}>Title</div>
      <div className={'title'}>{title}</div>
    </div>
    <div className={'row'}>
      <div className={'label'}>Description</div>
      <div className={'description'}>{description}</div>
    </div>
    <div className={'row'}>
      <div className={'label'}>Created by</div>
      <div className={'author'}>{author}</div>
    </div>
    {!!labels.length && (
      <div className={'row'}>
        <div className={'label'}>Tags</div>
        <div className={'labels'}>
          <Labels activeLabels={labels} />
        </div>
      </div>
    )}
    {url && (
      <div className={'row'}>
        <div className={'label'}>URL</div>
        <div className={'url'}>
          <a href={url} target={'_blank'}>
            {url}
          </a>
        </div>
      </div>
    )}
    {file && (
      <div className={'row'}>
        <div className={'label'}>Download</div>
        <div className={'files'}>
          <a onClick={() => window.open(`/uploads/files/${file}`, '_self')}>
            {file}
          </a>
        </div>
      </div>
    )}
  </ModalBody>
);
