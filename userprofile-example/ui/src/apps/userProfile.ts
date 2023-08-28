import {app, state, event, hook} from "../rxreact"
import {User} from "../../../shared/src/apps/userProfile";

export const useEmail = state<string>("userProfile", "email");
export const useFirstName = state<string>("userProfile", "firstName");
export const useLastName = state<string>("userProfile", "lastName");

export const useSave = event("userProfile", "save");

export const useUser = hook<User>("userProfile", "user");

export const UserProfile = app("userProfile");