angular.module('civis.youpower.translations',[])
.config(['$translateProvider', function ($translateProvider) {

  $translateProvider.translations('English', {
    About_You: "About You",
    Get_started: "Get Started",
    Personal_Profile: "Personal Profile",
    Your_Actions: "Your Actions",
    current: "Current Actions",
    Current_Actions: "Current Actions",
    completed: "Completed Actions", 
    pending: "Pending Actions", 
    Household_Actions: "Household Actions",
    Household_Profile: "Household Profile",
    Household_Owner: "Household Owner", 
    HOUSEHOLD_SETTING_DISABLED:  "You don't belong to any household at the mement. Household profile setting is disabled.",
    Energy_Data_Account: "Energy Data Account",
    Link_Energy_Data_Account: "Link Energy Data Account",
    APARTMENTID_INFO: "You will need ApartmentID and FamilyID to link your household's energy data with the app. The IDs are provided by the CIVIS team.",
    Postal_Code: "Postal Code",
    Household_Composition: "Household Composition",
    House_type: "House type",
    Detached_house: "Detached house",
    Town_house: "Town house",
    SIZE_M2: "in sq.m.",
    Number_of_Adults:    "Number of Adults",
    Number_of_Children:  "Number of Children",
    Major_Appliances: "Major Appliances",
    APPLIANCES_EG: "A description, e.g., 2x1000W heater",
    ALREADY_EXISTS: "Hmmm, this one already exits.",
    TERMS_CONDITION: "YouPower is a free social app for energy developed for the CIVIS EU research project. By signing up, you agree that the data you share with the app will be analysed for further research. Your data will be anonymous.",
    BE_MORE_GREEN: "Be more <span class='balanced'>green.</span>",
    BE_MORE_SOCIAL: "Be more <span class='energized'>social.</span>",
    TAKE_ACTIONS: "Take <span class='positive'>actions!</span>",
    Your_email_address: "Your email address",
    RECEIVER_EMAIL: "Receiver's Email address",
    RECEIVER_NAME: "Receiver's name", 
    Send_Invitation: "Send Invitation",
    SENDING_INVITATION: "Sending your invitation to {{email}}...",
    INVITATION_SENT: "Your invitation is sent.",
    INVITATION_NOT_SENT: "We can not send your invitation to {{email}}. An error occurred.",
    Your_name: "Your name",
    Your_password: "Your password",
    Select_your_password: "Select your password", 
    your_password: "Repeat your password", 
    Sign_up: "Sign up",
    JOIN_NOW: "Not a member? Join now",
    LOGIN_HERE: "Already a member? Login here",
    TRY_AGAIN: "Please try again.",
    Email: "Email",
    Login: "Login",
    Password: "Password",
    Email_address: "Email address",
    Show_me_less: "Show me less",
    Show_me_more: "Show me more", 
    Pending: "Pending",
    Recently_Completed: "Recently Completed",
    LEAVES_COUNT: "You gathered <i class='icon ion-leaf balanced icon-large'><span class='leaves-nr'>{{number}}</span></i>leaves in total",
    Add_Action: "Add Action", 
    Impact: "Impact",
    Effort: "Effort",
    Suggested_Action: "Suggested Action",
    TAKE_TO_SEE_MORE: "Take this action to see more.",
    Back_to_Your_Actions: "Back to Your Actions",
    ALREADY_DO: "I already do this<span ng-if=\"actions[action._id].type!='onetime'\"> consistently</span>.",
    REMIND: "Remind me in ____ days.",
    WANT_TO_DO: "I want to do this<span ng-if=\"actions[action._id].type=='common'\"> more consistently</span>.",
    NOT_WANT_TO_DO: "I don't want to do this.",
    NA_TO_ME: "This doesn't apply to me.",
    Participants: "Participants",
    Participant: "Participant",
    Likes: "Likes",
    Like: "Like",
    You_started_on: "You started on",
    You_restarted_on: "You restarted on", 
    Scheduled_for: "Scheduled for",
    You_completed_on: "You completed on", 
    You_confirmed_doing_this_on: "You confirmed doing this on", 
    Take_this_Action_Now: "Take this Action Now",
    Retake_this_Action: "Retake this Action", 
    HOW_ARE_YOU: "How are you doing?",
    HAVE_DONE_THIS: "I have done this<i ng-if=\"actions[action._id].type=='routine' || actions[action._id].type=='common'\"> consistently for {{number}}+ weeks</i>.",
    NOT_WANT_TO_DO_ANYMORE: "I don't want to do this any more.", 
    POSTPONE_THIS: "I want to postpone this action.",
    Delete: "Delete", 
    You: "You",
    Post: "Post", //like in post comments
    Share: "Share",
    Comment: "Comment",
    Comments: "Comments",
    Give_your_comment: "Give your comment ...", 
    Give_your_comments_here: "Give your comments here.",
    Cancel: "Cancel",
    Done: "Done",
    WHAT_ACTION_COMMENTS: "What are your comments or tips to other users in performing this action?", 
    RATE_EFFORT: "Please rate the level of <b>effort</b> for this action from 1 (very low) to 5 (very high):",
    Feedback_Form: "Feedback Form",
    EARN_EXTRA_POINTS: "You can earn <i class=\"icon ion-leaf icon-large balanced text-large\"></i> <span class=\"balanced text-large\">{{points}}</span> <span class=\"balanced\">extra</span> by filling the feedback form. We'd love to hear your opinion.",
    YOU_EARN: "Congratulations! You will earn", //in sentence: you will earn X points for the action: Y
    FOR_ACTION : "for the action:", //in sentence: you will earn X points for the action: Y
    Action_Completed: "Action Completed",
    Action_Removed: "Action Removed",
    OTHER_REASON_ABANDON: "Any other reasons that made you abandon the action? Or do you have other comments?", 
    SPECIFY_WHY: "Please specify so we know how to improve.", 
    SELECT_REASONS: "This action is not for you? Please select each of the following that is true to you:",
    NOT_USEFUL: "This action is not useful.",
    TOO_MUCH_EFFORT: "This action takes too much effort.",
    TOO_EXPENSIVE: "This action is too expensive.",
    NA_ANYMORE: "This action isn't appliable to you or your household any more.", 
    DO_NOT_LIKE: "You don't like to do this action.",
    ANOTHER_TRY: "Click to Give Another Try",
    EARN_POINTS: "You still can earn <i class=\"icon ion-leaf icon-large balanced\"></i> <span class=\"balanced text-large\">{{points}}</span> by filling the feedback form. We'd love to hear from you and know how to improve.",
    CLOSE_TO_FINISH: "You are so close to finish!",
    SORRY_TO_HEAR: "Oops! Sorry to hear that you are going to abandon the action:", 
    Action_Not_Completed: "Action Not Completed", 
    REMIND_ME_IN: "Remind me of this action in",
    SET_PENDING: "Set a Pending Action", 
    days: "days", 
    NUMBER_1000: "Please give a number between 1 and 1000!",
    a_number_of: "a number of", 
    Hi: "Hi", 
    NO_ACTION_TO_REHEARSE: "There is no action to rehearse. You have all actions in progess or pending. You are doing awesome",
    No_Action_to_Rehearse: "No Action to Rehearse",
    Change_Setting: "Change Setting", 
    ACTION_REHEARSAL_OPTIONS: "Action rehearsal options are all deactivated. You may change it in <samp>Settings</samp>.",
    Yes: "Yes",
    Not_now: "Not now",
    NO_MORE_ACTIONS_SETTING: "Unfortunately, we have no more new actions in our database for the moment. If you want to rehearse your past actions, please go to <samp>Settings</samp>. Would you like to do this now?", 
    NO_MORE_ACTIONS_REHEARSE: "We currently don\'t have new actions in our database. Would you like to rehearse the actions? (You can change this later in <samp>Settings</samp>.)", 
    ASK_ADD_MORE: "You already have {{number}} actions in progress. Would you like to add more?",
    NO_ADD_MORE: "You already have {{number}} actions in progress. You can add more actions after some of those are completed. Keep on! You are doing great",
    Postpone_Action: "Postpone Action", 
    POSTPONE_ACTION: "I don't want to do this now. Remind me of this action in",
    THANKS_FEEDBACK: "Many thanks for your feedback!",
    points: "points",
    point: "point", 
    You_got: "You got",
    OK: "OK",
    CONGRATS: "Great that you took this action. Congrats!",
    SORRY_NOT_SUIT: "We are sorry that this action didn't suit you well. Please keep on trying others.",
    ASK_ADD_ANOTHER_ACTION: "Would you like to add another action?",
    SORRY_ADD: "We are sorry that this action didn't suit you well. Would you like to try another one?",
    Congratulations: "Congratulations",
    ASK_SCHEDULE: "Would you like to make a schdule to retake this action in the future?", 
    FEEDBACK_NOT_COMPLETED: "Your Feedback Form is not Completed",
    FEEDBACK_ACTION_COMPLETED: "Would you like to give us some feedback on the action? </br>We'd love to hear from you.",
    FEEDBACK_ACTION_NOT_COMPLETED: "Would you like to give us some feedback on what went wrong? </br>We'd love to know how to improve.",
    Let_it_be: "Let it be",
    Invite_Household_Member: "Invite Household Member",
    Search_user_by_name: "Search user by name",
    In_Your_Household: "In Your Household",
    Invitation_sent: "Invitation sent", 
    current_actions: "current actions",
    current_action: "current action",
    CAN_NOT_FIND_USER: "Sorry, we can not find '{{name}}' among YouPower users. Please try another name.",
    Back_to_Household_Actions: "Back to Household Actions",
    CAN_NOT_FIND_USER_Q: "Can not find the one you are looking for?",
    SEND_INVITATION_EMAIL: "Send an Invitation by Email",
    name: "name", 
    YOU_DOING_AS_WELL: "You are doing this as well",
    YOU_DONE_THIS :"You have done this", 
    YOU_PENDING: "You have this one pending",
    Pending_Invitation: "Pending Invitation",
    JOIN_ONE_HOUSEHOLD_ONLY: "You may join one household only",
    INVITED_TO_HOUSEHOLD: "You are invited to join the household of",
    IGNORE: "IGNORE",
    ACCEPT: "ACCEPT",
    Invited_to_Your_Household: "Invited to Your Household",
    Waiting_for_reply: "Waiting for reply", 
    INVITE_MEMBER_HOUSEHOLD: "Invite Member to Your Household",
    HOUSEHOLD_INVITE_DISABLED: "Invite button is disabled. Only household owner can invite members.",
    LEAVE_HOUSEHOLD: "Leave Your Current Household", 
    YOU_HOUSEHOLD_OWNER: "You are a household owner.",
    ONE_MEMBER_HOUSEHOLD: "there is still a member in your household", 
    MEMBERS_HOUSEHOLD: "there are still members in your household",
    LEAVE_DISABLED: "Leave button is disabled because",
    CREATE_HOUSEHOLD: "Create Household by Your Own",
    NOT_ACCEPT_INVITATION: "Can not Accept Invitation",
    NOT_JOIN_HOUSEHOLD: "You can not join the household of {{name}} now. If you want to do so, you need to first leave your current household. You can also ask {{name}} to join your household instead.",
    OK_I_C: "OK, I see.", 
    Ignore_Invitation: "Ignore Invitation",
    IGNORE_INVITATION: "You are about to reject the invitation from {{name}}. We will then remove the invitation from your list. Would you like to continue?",
    Accept_Invitation: "Accept Invitation",
    ACCEPT_INVITATION: "You are about to accept the invitation from {{name}}. Afterwards you will become a member of that household. <span ng-show='currentUser.householdId !== null && households[currentUser.householdId].members.length === 1'>Your current household will be removed.</span> All members in the same household can see each other's actions, basic profile and household information. Would you like to continue?", 
    Accept: "Accept", 
    Leave_Household: "Leave Household", 
    ASK_REMOVE_HOUSEHOLD: "You are about to leave the household where you are an owner. The whole household (including the members, pending invitations and settings if any) will be removed afterwards! Would you like to continue?", 
    ASK_LEAVE_HOUSEHOLD: "You are about to leave the household of {{name}}. Afterwards you will be no longer a member of that household. You may join a household later with an invitation or create your own. Would you like to continue?", 
    Confirm_Invite: "Confirm Invite",
    CONFIRM_INVITE: "You are about to invite {{name}} to your household. If the person accepts your invite, you will be able to see the person's actions and basic profile, and vice versa. And you will share household information. Would you like to continue?",
    SUGGEST_ACTIONS: "Suggest actions that ...", //in sentence: suggest actions you completed ro rehearse. 
    you_completed: "you completed <span class='item-note item-text-wrap'>to rehearse.</span>", //in sentence: suggest actions you completed to rehearse. 
    you_declined: "you declined <span class='item-note item-text-wrap'>to reconsider.</span>", //in sentence: suggest actions you declinded to reconsider. 
    were_not_appliable: "were not appliable <span class='item-note item-text-wrap' transalte>to reassess.</span>", //in sentence: suggest actions that were not appliable to reconsider. 
    NAME_REQUIRED: "Your name is required", 
    Select_your_nickname: "Select your nickname",
    Name: "Name",
    Nickname: "Nickname",
    Gender: "Gender", 
    Male: "Male",
    Female: "Female", 
    Birthday: "Birthday",
    Preferred_Language: "Preferred Language",
    English: "English",
    Italian: "Italian",
    Swedish: "Swedish",
    About: "About", 
    Actions: "Actions",
    Log_Out: "Log Out",
    BACK: "<i class='icon ion-ios-arrow-back'></i> Back",
    Energy_Data: "Energy Data",
    Housing_Cooperatives: "Housing Cooperatives", 
    WHAT_UPOWER_T: "What is YouPower?",
    WHAT_UPOWER_P: "YouPower is a social app for energy. You can use it to discover saving tips and share experiences about different energy practices. Researchers from the EU CIVIS project are developing YouPower.",
    HOW_WORKS_T: "How it works?", 
    HOW_WORKS_P: "YouPower is designed based on research to connect you to friends, family and neighbors so that you can learn and take energy actions that are relevant to you together. For completing actions, you receive leaves.", 
    HOW_LEAVES_CALCULATED_T: "How are the leaves calculated?", 
    HOW_LEAVES_CALCULATED_P: "Each energy action has an associated impact score and an effort score (expert evaluated combined with users’ feedback). The number of leaves you receive for completing the action is a sum of those two scores. You also get leaves by giving feedbacks and comments (1 leaf each).",
    CREDIBILITY_T: "Credibility of the energy advice",
    CREDIBILITY_P: "We carefully selected the initial set of actions from trusted sources such as different national energy departments and international energy agencies and associations." ,
    EMAIL_T: "Other questions or comments?",
    EMAIL_P: "YouPower is an ongoing project. We are happy to learn about what you think, what works for you and how we can do better. Contact us at <a href='mailto:youpower.app@gmail.com?Subject=YouPower%20Questions%20and%20Feedback' class='balanced'>YouPower.app@gmail.com</a>.",
    Schedule_Action: "Schedule Action", 
    RETAKE_ACTION: "I want to retake the action:",
    Remind_me_in: "Remind me in",
    Save: "Save", 
    ACTION_SCHEDULED: "Congratulations and thanks. The action is scheduled in {{number}} days.",
    Action_Scheduled: "Action Scheduled",
    MORE_ACTION: "More Action?",
    ADD_ONE: 'Would you like to add one?',
    ADD_ANOTHER_ONE: 'Would you like to add another one?',
    YOU_NO_ACTION: "You currently have no action in progress.",
    YOU_1_ACTION: "You currently have 1 action in progress.",
    YOU_N_ACTION: "You currently have {{number}} actions in progress.",

  });

  $translateProvider.translations('Italian', {
    About_You: "Su Di Te",
    Birthday: "Compleanno",
    CHANGE: "CAMBIAMENTO",
    Cancel: "Annullare",
    English: "Inglese",
    Female: "Femminile", 
    Gender: "Genere",
    Get_started: "Iniziare",
    Italian: "Italiano", 
    Language: "Lingua",
    Male: "Maschio",
    Name: "Nome", 
    Personal_Profile: "Profilo Personale",
    Save: "Salvare", 
    Settings: "Impostazioni",
    Username: "Nome Utente", 
    Yes: "sì",
  });


  $translateProvider.preferredLanguage('English')
    .fallbackLanguage('English');
}]);
