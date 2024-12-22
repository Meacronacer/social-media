import { LinkTo } from "@/utils/links";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <section>
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 pb-20">
        <div className="mx-auto flex min-h-[100vh] w-full flex-col justify-center px-5 pt-0 md:h-[unset] md:max-w-[50%] lg:h-[100vh] lg:max-w-[50%] lg:px-6">
          <div className="mx-auto my-auto mb-auto flex w-[350px] max-w-[450px] flex-col md:mt-[70px] md:max-w-[450px] lg:mt-[130px] lg:max-w-[450px]">
            <p className="text-[32px] font-bold text-white">Sign Up</p>
            <div className="relative my-4">
              <div className="relative flex items-center py-1">
                <div className="grow border-t border-zinc-800"></div>
                <div className="grow border-t border-zinc-800"></div>
              </div>
            </div>
            <div>
              <form className="mb-4">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <label className="text-white" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="mb-2 mr-2.5 h-full min-h-[44px] w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400"
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      name="email"
                    />
                    <label
                      className="mt-2 text-zinc-950 dark:text-white"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      placeholder="Password"
                      type="password"
                      className="mb-2 mr-2.5 h-full min-h-[44px] w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400"
                      name="password"
                    />
                  </div>
                  <button
                    className="focus-visible:ring-ring mt-6 flex w-full max-w-full items-center justify-center whitespace-nowrap rounded-lg bg-white px-4 py-4 text-base font-medium text-zinc-950 ring-offset-background transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:bg-white/80 disabled:pointer-events-none disabled:opacity-50"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <p>
                <a
                  href="/dashboard/signin/forgot_password"
                  className="text-sm font-medium text-white"
                >
                  Forgot your password?
                </a>
              </p>
              <p>
                <Link
                  href={LinkTo.login}
                  className="text-sm font-medium text-white"
                >
                  Already have an account? Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
