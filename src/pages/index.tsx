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
import Header from '../components/Header';

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

          data.results.forEach((post: any) => {
            const postResponse = {
              uid: post.uid,
              first_publication_date: format(
                new Date(post.last_publication_date),
                'dd MMM yyyy',
                { locale: ptBr }
              ),
              data: {
                title: RichText.asText(post.data.title),
                subtitle:
                  post.data.content.find(
                    content => content.type === 'paragraph'
                  )?.text ?? '',
                author: RichText.asText(post.data.author),
              },
            };
            setResults([...results, postResponse]);
          });
        });
    }
  }

  return (
    <>
      <Header />
      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {results.map((post: Post) => (
            <Link href={`/post/${post.uid}`} key={post.uid} passHref>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.data_post}>
                  <span>
                    <FiCalendar size={20} color="#d7d7d7" />
                    {post.first_publication_date}
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
            <button type="button" onClick={loadMore}>
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
      pageSize: 1,
    }
  );

  const posts = response.results.map((post: any) => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.last_publication_date),
        'dd MMM yyyy',
        { locale: ptBr }
      ),
      data: {
        title: RichText.asText(post.data.title),
        subtitle:
          post.data.content.find(content => content.type === 'paragraph')
            ?.text ?? '',
        author: RichText.asText(post.data.author),
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      },
    },
  };
};
