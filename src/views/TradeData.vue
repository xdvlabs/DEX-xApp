<template>
    <div class="h-100">
        <Header />
        <div id="trade-data-wrapper">
            <div id="trade-data-container">
                <MarketData />
                <hr>
                <div>
                    <Chart />
                </div>
                <div class="tabs-row">
                    <label>
                        <input type="radio" :value="1" name="data-tabs" id="data-tabs1" v-model="activeTab"/>
                        <span>Order Book</span>
                    </label>

                    <label>
                        <input type="radio" :value="2" name="data-tabs" id="data-tabs2" v-model="activeTab"/>
                        <span>History</span>
                    </label>
                </div>
                <hr>
                <MarketDepth v-if="activeTab === 1"/>
                <TradeHistory v-if="activeTab === 2"/>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/TradeData/Header'
import MarketData from '@/components/TradeData/MarketData'
import Chart from '@/components/TradeData/TradeView'
import MarketDepth from '@/components/TradeData/MarketDepth.vue'
import TradeHistory from '@/components/TradeData/TradeHistory.vue'

export default {
    name: 'MarketDataExpanded',
    components: { Header, MarketData, Chart, MarketDepth, TradeHistory },
    data() {
        return {
            activeTab: 1
        }
    }
}
</script>

<style>

#trade-data-wrapper {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
}
#trade-data-wrapper::-webkit-scrollbar {
    width: 0;
    height: 0;
}

#trade-data-container {
    
}
</style>