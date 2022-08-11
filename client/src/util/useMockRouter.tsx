const useMockRouter = (pathname = '/signup') => {
  const useRouter = jest.spyOn(require('next/router'), 'useRouter');
  useRouter.mockReturnValue({ pathname });
}

export default useMockRouter;