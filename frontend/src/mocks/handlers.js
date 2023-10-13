import { rest } from "msw";

const baseURL = "https://pythonista-api-5cfcbbfd2406.herokuapp.com/"

export const handlers = [
    // mocks a request to get the logged in user
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
          ctx.json({
            pk: 24,
            username: "Jasmin",
            email: "",
            first_name: "",
            last_name: "",
            profile_id: 24,
            profile_image: "https://res.cloudinary.com/drpij1z8t/image/upload/v1/media/images/jasmin_mjwcpi"
            })
        );
      }),
      // mocks a request to log a user out
      rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200));
      }),
      
      // mocks a request for profile
    rest.get(`${baseURL}profiles/`, (req, res, ctx) => {
        return res(ctx.json({
            id: 25,
            owner: "Alexa",
            full_name: "",
            bio: "",
            created_at: "04 Aug 23",
            updated_at: "04 Aug 23",
            github: "",
            linkedin: "",
            website: "",
            stack_overflow: "",
            image: "https://res.cloudinary.com/drpij1z8t/image/upload/v1/media/../default_profile_re4vqr",
            is_owner: false,
            following_id: null,
            posts_count: 0,
            events_count: 1,
            followers_count: 1,
            following_count: 1
            })
        );
    }),

      // mocks a request for an event
    rest.get(`${baseURL}events/`, (req, res, ctx) => {
        return res(ctx.json({
            id: 5,
            owner: "Alexa",
            title: "Coding Bootcamp",
            description: "Coding bootcamps arent going to solve the software developer needs Georgia faces, but they can help. If you are interested in a new career it might be wise to check out our Pythonista page.",
            location: "Berlin, Germany",
            starts_at: "08:00",
            ends_at: "16:00",
            created_at: "04 Aug 23",
            updated_at: "04 Aug 23",
            image: "https://res.cloudinary.com/drpij1z8t/image/upload/v1/media/images/bootcamp_uty7rs",
            event_date: "2023-08-22",
            is_owner: false,
            profile_id: 25,
            profile_image: "https://res.cloudinary.com/drpij1z8t/image/upload/v1/media/../default_profile_re4vqr",
            join_id: null,
            conversations_count: 1,
            joins_count: 1,
            organizer: "WomenHack Berlin"
            })
        );
    }),

    // mocks a request for a post
    rest.get(`${baseURL}posts/`, (req, res, ctx) => {
      return res(ctx.json({
        id: 14,
        owner: "Jasmin",
        content: "Apple's yearly developer conference is today.",
        created_at: "05 Aug 23",
        updated_at: "05 Aug 23",
        image: "https://res.cloudinary.com/drpij1z8t/image/upload/v1/media/images/apple_vkm8ui",
        is_owner: true,
        profile_id: 24,
        profile_image: "https://res.cloudinary.com/drpij1z8t/image/upload/v1/media/images/jasmin_mjwcpi",
        like_id: null,
        likes_count: 0,
        comments_count: 0
        })
      );
  }),
    
     // mocks a request for a conversation
     rest.get(`${baseURL}conversations/`, (req, res, ctx) => {
        return res(ctx.json({
            id: 11,
            event: 5,
            content: "Please fill out the registration form for signup!",
            created_at: "3 days, 21 hours ago",
            updated_at: "3 days, 21 hours ago",
            owner: "Jasmin",
            is_owner: false,
            profile_id: 24,
            profile_image: "https://res.cloudinary.com/drpij1z8t/image/upload/v1/media/images/jasmin_mjwcpi"
            })
        );
    }),

    // mocks a request for a comment
    rest.get(`${baseURL}conversations/`, (req, res, ctx) => {
      return res(ctx.json({
        id: 28,
        owner: "sediqa_hadid",
        post: 10,
        content: "Hello from Pythonista",
        is_owner: false,
        profile_id: 2,
        profile_image: "https://res.cloudinary.com/drpij1z8t/image/upload/v1/media/images/pic_xbjb6s",
        created_at: "1 week, 1 day ago",
        updated_at: "1 week, 1 day ago"
        })
      );
  }),
];