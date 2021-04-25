import { GetStaticProps } from 'next';
import Link from 'next/link';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import ptBr from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): any {
  const [nextPage, setNextPage] = useState<string>(postsPagination.next_page);
  const [results, setResults] = useState<Post[]>(postsPagination.results);

  async function loadMore(): Promise<void> {
    if (nextPage) {
      fetch(postsPagination.next_page)
        .then(response => response.json())
        .then(data => {
          setNextPage(data.next_page);
          const postResponse = [
            {
              uid: 'como-utilizar-hooks-2',
              first_publication_date: '2021-03-15T19:25:28+0000',
              data: {
                title: 'Como utilizar Hooks',
                subtitle: 'Pensando em sincronização em vez de ciclos de vida',
                author: 'Joseph Oliveira',
              },
            },
            {
              uid: 'criando-um-app-cra-do-zero-3',
              first_publication_date: '2021-03-25T19:27:35+0000',
              data: {
                title: 'Criando um app CRA do zero',
                subtitle:
                  'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
                author: 'Danilo Vieira',
              },
            },
          ];
          setResults([...results, ...postResponse]);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  return (
    <>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="logo" />
      </div>
      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {results.map((post: Post) => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.data_post}>
                  <span>
                    <FiCalendar size={20} color="#d7d7d7" />
                    <time>
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        { locale: ptBr }
                      )}
                    </time>
                  </span>
                  <span>
                    <FiUser size={20} color="#d7d7d7" />
                    {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          ))}
          {nextPage && (
            <button type="button" onClick={() => loadMore()}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (): Promise<any> => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content', 'post.author'],
      pageSize: 2,
    }
  );

  const posts = [
    {
      uid: 'como-utilizar-hooks',
      first_publication_date: '2021-03-15T19:25:28+0000',
      data: {
        title: 'Como utilizar Hooks',
        subtitle: 'Pensando em sincronização em vez de ciclos de vida',
        author: 'Joseph Oliveira',
      },
    },
    {
      uid: 'criando-um-app-cra-do-zero',
      first_publication_date: '2021-03-25T19:27:35+0000',
      data: {
        title: 'Criando um app CRA do zero',
        subtitle:
          'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
        author: 'Danilo Vieira',
      },
    },
  ];

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      },
    },
  };
};
