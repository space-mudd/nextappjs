import React from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignInFormProps {
  showForm: any;
  setShowForm: any;
}
function SignInForm({ showForm, setShowForm }: SignInFormProps) {
  return (
    <div>
      <Dialog open={showForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Sign In</DialogTitle>
            <DialogDescription>
              <div className="mt-6">
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="mt-1">
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    //disabled={!isSent && isCustomLoading}
                    //onClick={handleCustomEmailSignIn}
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {
                      //isCustomLoading ? <Spinner /> : "Sign in with Email"}
                    }
                    Sign in with Email
                  </Button>
                </form>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        setShowForm(false);
                      }}
                      className="w-full bg-white text-gray-600 font-semibold py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <div className="flex items-center justify-center">
                        Continue as a guest
                      </div>
                    </Button>
                    <div
                      onClick={() => setShowForm(false)}
                      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                      <span className="sr-only">Close</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SignInForm;
