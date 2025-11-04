<template>
    <div class=" personal-center-container container-row-768-column">
        <div class="personal-center-left">
            <div class=" personal-center-left-top bg-card shadow-black">
                <QAvatar size="100px" :url="userStore.getUser?.avatar==''?'/figure.webp':userStore.getUser?.avatar"></QAvatar>
                <h2>{{ userStore.getUser?.username }}</h2>
                <p :style="{color: userStore.getUser?.is_active?'green':'red'}">{{ userStore.getUser?.is_active?'Active':'Inactive'}}</p>
                <div class=" container bg-body padding-46rem container-align-center container-w100">
                    <QIcon class=" padding-24rem text-primary" icon="Setting" size="16px" />
                    <div>
                        <p>Email</p>
                        <p class=" text-08rem">{{ userStore.getUser?.email }}</p>
                    </div>
                </div>
                <QFormButton type="button" class=" button-outline padding-24rem container-w100">
                    <div class=" container container-w100 container-center gap-half">
                        <QIcon icon="Edit" size="16px" />
                        <span>修改资料</span>
                    </div>
                </QFormButton>
                <QFormButton type="button" class=" padding-24rem exit-button container-w100" 
                    @click="()=>exitHandler()"
                >
                        <span>退出登录</span>
                </QFormButton>
            </div>
            <div class="personal-center-left-top bg-card shadow-black">
                <div class=" container container-w100 gap-half">
                    <QIcon icon="Book" size="24px" class="text-primary"/>
                    <h3>Reading Statistics</h3>
                </div>
                <div class=" container-w100 container-space-between">
                    <span>Books Read</span>
                    <h4>111</h4>
                </div>
                <div class=" container-w100 container-space-between">
                    <span>Pages Read</span>
                    <h4>111</h4>
                </div>
                <div class=" container-w100 container-space-between">
                    <span>Current Streak</span>
                    <h4 class="text-primary">18days</h4>
                </div>
                <hr/>
                <p class=" container-w100">Favorite Genres</p>
                <p class=" container-w100 container-wrap container gap">
                    <span class="personal-center-user-favorite">Fiction</span>
                    <span class="personal-center-user-favorite">Mystery</span>
                    <span class="personal-center-user-favorite">Science Fiction</span>
                </p>
            </div>
        </div>
        <div class="personal-center-right">
            <div class="personal-center-right-top bg-card shadow-black">
                <div class=" container container-w100 gap-half container-align-center">
                    <QIcon icon="Heart" size="24px" class="text-primary"/>
                    <h3>Currently Reading</h3>
                </div>
                <div 
                    v-for=" histortItem in currentRead" 
                    class="personal-center-current-read bg-body mouse-cursor"
                    @click="router.push(`/book-read/${histortItem.id}/${histortItem.last_chapter_id}`)"
                >
                    <QLazyImage :src="histortItem.cover" :height="height" :width="width">

                    </QLazyImage>
                    <div class="personal-center-current-read-content">
                        <h4 class=" text-one-line ">{{ histortItem.name }}</h4>
                        <p class=" container gap-fourth">
                            <QIcon icon="User" size="14px"></QIcon>
                            <h5>{{ histortItem.author }}</h5>
                        </p>
                        <div class=" container-column gap-half" style="align-items: baseline;">
                            <div class=" container-w100 container-space-between ">
                                <span class="text-08rem">阅读进度</span>
                                <span class="text-08rem">{{ (histortItem.last_position/histortItem.total_chapter*100).toFixed(1) }}%</span>
                            </div>
                            <div class=" personal-center-current-read-progressbar">
                                <QProgressBar :percent="`${histortItem.last_position*100/histortItem.total_chapter}px`"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class=" personal-center-right-top bg-card shadow-black">
                <div class=" container-w100">
                    <h3>Reading Goals</h3>
                </div>
                <div class=" container-w100 gap   container-row-768-column text-white">
                    <div class=" personal-goals-item padding-rem radius-rem container-column gap line-gradient-purple">
                        <p>This Month</p>
                        <h2>8/12 books</h2>
                    </div>
                    <div class=" personal-goals-item padding-rem radius-rem container-column gap line-gradient-green">
                        <p>This Year</p>
                        <h2>24/50 books</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../store';
import { useReadingHistoryStore } from '../store/useReadingHistoryStore';
import { QIcon,QFormButton,QLazyImage,QAvatar,QProgressBar } from 'qyani-components';
import router from '../route';

const userStore = useAuthStore();
const readhistoryStore = useReadingHistoryStore();
const currentRead = computed(()=>{
    return readhistoryStore.getReadingHistory.slice(0,3);
});
const width =64;
const height = 96;
const  exitHandler =  ()=>{
    userStore.clearUser();
    userStore.clearToken();
    window.location.reload();
}
</script>

<style scoped lang="css">

</style>